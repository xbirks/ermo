-- =============================================================
-- Migración 022 · Los dos gastos anuales del coche, y tres avisos
--                 que faltaban
--
-- LO QUE DICE EL HISTÓRICO (2023-2026, 1.989 movimientos)
--
-- Impuesto de circulación, como «TRIBUTOS», siempre desde Imagin:
--     13/10/2024 · 118,70 €
--     10/11/2025 · 118,70 €
-- Mismo importe los dos años (Andrés lo recordaba como «unos 120»,
-- clavado), pero la fecha se movió casi un mes. Por eso van dos
-- cosas: el gasto en noviembre, que es lo último que pasó, y un
-- aviso el 1 de octubre, para que si repite lo de 2024 no le pille.
--
-- Mantenimiento del coche:
--     02/07/2024 · 532,01 €  (MAZDA ALMENAR AUS)
--     03/10/2025 · 250,00 €  (MAZDA, pagado desde B100)
--     12/01/2024 ·  56,15 €  (ITV, aparte)
-- No sigue calendario: va por kilómetros. Se deja en octubre, que es
-- cuando cayó el último, con el importe que ha dicho Andrés (280 €).
--
--     OJO: el histórico dice que 2024 fue el caro (532 €) y 2025 el
--     barato (250 €). Si de verdad alternan, a 2026 le tocaría el
--     caro, no el barato. Queda anotado para que Andrés lo confirme
--     con el taller; si son 500 y pico, se cambia el previsto.
--
-- Pagos de IVA (mod. 303), siempre desde Imagin. Doce trimestres
-- seguidos y el patrón no falla:
--     abril, julio y octubre → día 20, 21 o 22
--     enero                  → día 30
-- El aviso va el día 19, cada tres meses. En enero avisa once días
-- antes en vez de uno, que para juntar mil y pico euros no sobra.
--
-- Cuota de autónomos: la TGSS cobra el último día hábil del mes, y
-- sale de Santander, que es la cuenta que se queda seca. El aviso va
-- el 29 para dar margen a traspasar desde Imagin.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- =============================================================


-- -------------------------------------------------------------
-- 1. IMPUESTO DE CIRCULACIÓN
--
-- La categoría ya existía (suelta, sin importe ni fecha). Se
-- convierte en gasto fijo anual en vez de crear otra al lado, para
-- no partir en dos el histórico.
-- -------------------------------------------------------------
UPDATE categorias
SET es_fijo          = true,
    activa           = true,
    importe_previsto = 118.70,
    cuenta_id        = (SELECT id FROM cuentas WHERE nombre = 'Imagin'),
    dia_cobro        = 10,
    cada_meses       = 12,
    primer_mes       = DATE '2026-11-01',
    notas            = 'IVTM. Llega como «TRIBUTOS» desde Imagin. 118,70 € en 2024 y en 2025, pero la fecha baila: 13/10/2024 y 10/11/2025. Hay un aviso el 1 de octubre por si se adelanta.'
WHERE nombre = 'Impuesto circulación';


-- -------------------------------------------------------------
-- 2. MANTENIMIENTO DEL COCHE
-- -------------------------------------------------------------
INSERT INTO categorias (nombre, es_fijo, importe_previsto, cuenta_id, dia_cobro, cada_meses, primer_mes, notas)
SELECT 'Mantenimiento del coche', true, 280.00,
       (SELECT id FROM cuentas WHERE nombre = 'Imagin'), 3, 12, DATE '2026-10-01',
       'Revisión del Mazda 3. No va por calendario sino por kilómetros: 02/07/2024 (532,01 €) y 03/10/2025 (250 €, pagado desde B100). Andrés dice que a 2026 le toca la barata, unos 280 €; el histórico sugiere lo contrario. Confirmar con el taller. La ITV va aparte (56,15 € en enero de 2024).'
WHERE NOT EXISTS (SELECT 1 FROM categorias WHERE nombre = 'Mantenimiento del coche');


-- -------------------------------------------------------------
-- 3. LOS TRES AVISOS
--
-- Los avisos no mueven dinero ni cuentan como gasto: sólo escriben
-- por Discord el día que toca.
-- -------------------------------------------------------------
INSERT INTO avisos (concepto, dia, cada_meses, primer_mes, notas)
SELECT v.concepto, v.dia, v.cada, v.primer::date, v.notas
FROM (VALUES

  -- Un día antes de cada liquidación de IVA. En enero el plazo acaba
  -- el 30, así que ese trimestre avisa con más margen.
  ('Mañana se paga el IVA (mod. 303) desde Imagin. Comprueba que está el dinero.',
   19, 3, '2026-10-01',
   'El cargo cae el 20, 21 o 22 en abril, julio y octubre; en enero, el 30. Doce trimestres seguidos con ese patrón.'),

  -- La cuota de autónomos sale de Santander, que es la cuenta que se
  -- queda corta. Dos días de margen para traspasar desde Imagin.
  ('Pasado mañana cobra la TGSS la cuota de autónomos (302,60 €) en Santander. Si no llega, traspasa desde Imagin.',
   29, 1, '2026-09-01',
   'La TGSS cobra el último día hábil del mes. Santander es la cuenta con menos colchón, así que conviene mirarlo antes.'),

  -- El impuesto de circulación se adelantó a octubre en 2024.
  ('Este mes o el que viene llega el impuesto de circulación (unos 118,70 €) a Imagin.',
   1, 12, '2026-10-01',
   'En 2024 llegó el 13 de octubre; en 2025, el 10 de noviembre. El gasto está previsto en noviembre; esto es el aviso por si se adelanta.')

) AS v(concepto, dia, cada, primer, notas)
WHERE NOT EXISTS (
  SELECT 1 FROM avisos a WHERE a.concepto = v.concepto
);


-- -------------------------------------------------------------
-- 4. COMPROBACIONES
-- -------------------------------------------------------------
SELECT nombre, importe_previsto, dia_cobro, cada_meses, primer_mes,
       (SELECT nombre FROM cuentas WHERE id = categorias.cuenta_id) AS cuenta
FROM categorias
WHERE nombre IN ('Impuesto circulación', 'Mantenimiento del coche', 'Seguro coche (anual)');

SELECT dia, cada_meses, primer_mes, activo, left(concepto, 70) AS concepto
FROM avisos ORDER BY dia;
