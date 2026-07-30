-- =============================================================
-- Migración 001 · Gastos fijos como sección estable
--
-- Los recibos que se repiten cada mes (gestoría, seguro, coche, Digi,
-- cuota de autónomos, las suscripciones) dejan de ser sólo una
-- categoría marcada como fija: pasan a tener cuenta de cargo, día de
-- cobro y la posibilidad de darse de baja sin perder el histórico.
--
-- Con eso, empezar el mes es cargar la lista de una vez en lugar de
-- rellenar ocho formularios.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================

-- De qué cuenta sale el recibo. Sin esto habría que elegirla a mano
-- cada vez, y siempre es la misma: los 512 € salen de Imagin y las
-- suscripciones de Santander.
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS cuenta_id UUID REFERENCES cuentas(id) ON DELETE SET NULL;

-- Día aproximado de cobro (1-31). Sirve para ordenar la lista como
-- van llegando y para avisar de lo que está por venir.
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS dia_cobro SMALLINT
  CONSTRAINT dia_cobro_valido CHECK (dia_cobro IS NULL OR (dia_cobro BETWEEN 1 AND 31));

-- Un recibo que se da de baja se desactiva, no se borra: los
-- movimientos de meses anteriores tienen que seguir apuntando a su
-- categoría.
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS activa BOOLEAN NOT NULL DEFAULT true;

-- Notas del recibo: "renovar en septiembre", "revisar, ha subido".
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS notas TEXT;

-- Cada cuántos meses llega el recibo. 1 = mensual, 3 = trimestral,
-- 12 = anual (el seguro de la moto), 0 = no es periódico.
--
-- Sin esto, un recibo anual tendría que quedarse fuera de los fijos
-- para no cargarse cada mes, y entonces desaparece del radar. Que es
-- justo lo que pasa con el seguro de la moto: la nota "OJO SEGURO
-- MOTO, renovar o 68 €" existe porque se olvida.
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS cada_meses SMALLINT NOT NULL DEFAULT 1
  CONSTRAINT cada_meses_valido CHECK (cada_meses BETWEEN 0 AND 60);

-- Mes en que toca por primera vez. Combinado con cada_meses dice
-- exactamente en qué meses hay que cargarlo: un recibo anual que
-- empieza en septiembre toca cada septiembre.
ALTER TABLE categorias
  ADD COLUMN IF NOT EXISTS primer_mes DATE;

CREATE INDEX IF NOT EXISTS idx_categorias_fijas
  ON categorias (es_fijo, activa) WHERE es_fijo;

-- -------------------------------------------------------------
-- ¿Toca este recibo en el mes indicado?
--
-- Mensual: siempre. Anual o trimestral: sólo si la distancia en meses
-- desde primer_mes es múltiplo de cada_meses.
-- -------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_toca_en_mes(
    p_cada_meses SMALLINT,
    p_primer_mes DATE,
    p_mes        DATE
) RETURNS BOOLEAN AS $$
DECLARE
  distancia INT;
BEGIN
  IF p_cada_meses IS NULL OR p_cada_meses = 0 THEN RETURN false; END IF;
  IF p_cada_meses = 1 THEN RETURN true; END IF;
  -- Sin mes de inicio no se puede calcular el ciclo: se asume que sí,
  -- y ya lo ajustará quien revise la lista antes de confirmar.
  IF p_primer_mes IS NULL THEN RETURN true; END IF;

  distancia := (EXTRACT(YEAR FROM p_mes)::INT - EXTRACT(YEAR FROM p_primer_mes)::INT) * 12
             + (EXTRACT(MONTH FROM p_mes)::INT - EXTRACT(MONTH FROM p_primer_mes)::INT);

  RETURN distancia >= 0 AND distancia % p_cada_meses = 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- -------------------------------------------------------------
-- Asigna a cada recibo su cuenta y su día, según las hojas de papel.
-- Sólo rellena lo que esté vacío: no pisa cambios hechos a mano.
-- -------------------------------------------------------------
UPDATE categorias SET
  cuenta_id = (SELECT id FROM cuentas WHERE nombre = 'Imagin'),
  dia_cobro = 1
WHERE nombre IN ('Gestoría', 'Seguro', 'Coche', 'Internet Digi')
  AND cuenta_id IS NULL;

UPDATE categorias SET
  cuenta_id = (SELECT id FROM cuentas WHERE nombre = 'Santander'),
  dia_cobro = 3
WHERE nombre IN ('Netflix', 'Vodafone', 'Lowi', 'iPhone', 'ChatGPT')
  AND cuenta_id IS NULL;

UPDATE categorias SET
  cuenta_id = (SELECT id FROM cuentas WHERE nombre = 'Santander'),
  dia_cobro = 10
WHERE nombre = 'Cuota autónomos'
  AND cuenta_id IS NULL;

-- El seguro de la moto es semestral: sigue siendo un recibo fijo, pero
-- sólo toca dos veces al año. Así no se carga cada mes y a la vez no
-- desaparece de la lista, que es lo que provoca el "OJO SEGURO MOTO"
-- escrito a mano.
--
-- El mes de partida está puesto a diciembre porque es cuando aparece
-- en las hojas; con periodicidad semestral, tocaría en diciembre y en
-- junio. Si no es correcto, se cambia desde la pantalla de gastos
-- fijos.
UPDATE categorias SET
  es_fijo    = true,
  cada_meses = 6,
  primer_mes = COALESCE(primer_mes, DATE '2025-12-01'),
  cuenta_id  = COALESCE(cuenta_id, (SELECT id FROM cuentas WHERE nombre = 'Santander')),
  notas      = COALESCE(notas, 'Semestral. Al renovar, comparar precio: subió a 68 €.')
WHERE nombre = 'Seguro moto';

-- El resto de recibos fijos son mensuales (cada_meses = 1 por defecto).

-- -------------------------------------------------------------
-- Comprobación: los recibos fijos con su cuenta y su día.
-- -------------------------------------------------------------
SELECT
  c.nombre,
  c.importe_previsto AS importe,
  cu.nombre          AS cuenta,
  c.dia_cobro        AS dia
FROM categorias c
LEFT JOIN cuentas cu ON cu.id = c.cuenta_id
WHERE c.es_fijo AND c.activa
ORDER BY cu.nombre, c.dia_cobro, c.nombre;
