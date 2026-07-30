# Finanzas · puesta en marcha

App privada de control de gastos. Vive en `/interno/finanzas`, tras
contraseña, y no la indexa ningún buscador.

## 1. Crear la base de datos

Supabase (plan gratuito de sobra para este volumen):

1. Entra en <https://supabase.com> y crea un proyecto. Región: Frankfurt
   (`eu-central-1`). Guarda la contraseña de la base de datos que te
   pide al crearlo: no se puede volver a ver, sólo regenerar.
2. Ve al **SQL Editor** y ejecuta **primero** `schema.sql` y **después**
   `seed.sql`. Los dos ficheros están en esta carpeta. Pega el contenido
   y pulsa *Run*.
3. Copia la cadena de conexión: botón **Connect** (arriba) →
   **Connection pooling** → modo **Transaction**. Tiene esta forma:

   ```
   postgresql://postgres.abcdefgh:TU_CLAVE@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

   Añádele `?sslmode=require` al final si no lo trae.

Los dos scripts se pueden relanzar sin romper ni duplicar nada.

### Por qué el pooler y no la conexión directa

Supabase ofrece dos cadenas: la directa (puerto **5432**) y la del
pooler (puerto **6543**). Para Vercel hay que usar **la del pooler**.

Cada función de Vercel se ejecuta en un proceso independiente, y cada
proceso abre sus propias conexiones. Con la conexión directa, unas pocas
visitas simultáneas multiplican las conexiones hasta agotar el límite
del plan gratuito y la app empieza a dar errores de conexión. El pooler
existe justamente para eso: reparte un puñado de conexiones reales entre
todas las instancias.

`app/lib/finanzas/db.js` detecta el pooler por el puerto y ajusta el
tamaño del pool y los prepared statements en consecuencia. No hay que
configurar nada más.

### Row Level Security

Supabase avisará de que las tablas no tienen RLS activado. En este caso
no hace falta y activarlo rompería la app: aquí no se usa la API pública
de Supabase ni su sistema de usuarios. La app se conecta como `postgres`
por Postgres directo, y el único control de acceso es la contraseña del
middleware. Las claves `anon` y `service_role` de Supabase no se usan en
ningún sitio, así que no hay una vía pública que proteger.

## 2. Variables de entorno

Tres, y ninguna va al repositorio.

| Variable | Qué es |
|---|---|
| `DATABASE_URL` | La cadena del pooler (puerto 6543) del paso anterior. |
| `FINANZAS_PASSWORD` | Tu contraseña de acceso. Larga y sin reutilizar. |
| `FINANZAS_JWT_SECRET` | Cadena aleatoria de 32+ caracteres para firmar la sesión. |

Genera el secreto con:

```bash
openssl rand -base64 32
```

**En local:** rellena `.env.local` (ya está creado y lo ignora git).

**En Vercel:** Project → Settings → Environment Variables. Añade las
tres para *Production*, *Preview* y *Development*. Después hay que
volver a desplegar: las variables no se aplican a un despliegue ya
hecho.

## 3. Entrar

En local: `npm run dev` y abre <http://localhost:3000/interno/finanzas>.

En producción: `https://ermo.es/interno/finanzas`.

## Cómo está montado

`middleware.js` intercepta `/interno/finanzas/*` y `/api/finanzas/*`
antes de que se ejecute nada. Sin cookie de sesión válida, las páginas
redirigen al login y las APIs devuelven 401. La cookie es `httpOnly`
y firmada, dura 30 días, y la contraseña se compara en tiempo constante
para no filtrar información por la duración de la respuesta.

### Las tablas

- **cuentas** · Las cinco: Imagin, Santander, B100, MyInvestor y
  Cartera Efectivo. `saldo_actual` no se escribe a mano: lo recalcula
  un trigger a partir de las transacciones, así que no puede
  desincronizarse del histórico.
- **categorias** · `es_fijo` marca los recibos que se repiten cada mes.
  `importe_previsto` guarda lo que debería costar, para detectar
  cuando un recibo sube.
- **transacciones** · Ingresos, gastos y traspasos entre cuentas
  propias. Los importes son siempre positivos; el signo lo pone
  `tipo_movimiento`. Sacar dinero del cajero es un traspaso, nunca un
  gasto.
- **provisiones_iva** · Un apunte por mes. `trimestre_fiscal` se
  calcula solo, y permite liquidar el trimestre completo de una vez
  (los "452 + 452 + 525 = 1429 €" de las hojas a mano).
- **reservas** · Dinero que está en la cuenta pero no se puede gastar,
  con el motivo escrito al lado. De aquí sale el 409 € arrastrado de
  abril a junio: "no tocar, esperar a la declaración de renta".

### Las vistas

- **v_saldo_disponible** · La diferencia entre lo que dice el banco y
  lo que se puede gastar: descuenta el IVA retenido y las reservas
  activas.
- **v_resumen_mensual** · La cascada de la hoja de papel. El reparto a
  ahorro e inversión se muestra aparte y **no** se resta para llegar al
  total limpio, porque en las hojas ese reparto se decide *después* de
  tener el limpio calculado.

## Detalles que conviene no romper

`app/style.scss` aplica `cursor: none !important` a todo el documento y
`user-select: none` a los campos, para el cursor personalizado de la web
pública. La app de finanzas lo deshace dentro de `.fz`: sin eso no se ve
el puntero ni se puede seleccionar texto al teclear importes.

El header, el footer, el banner de cookies y el cursor se pintan desde
`app/components/cromo-publico.jsx`, que los oculta en las rutas
internas. Si añades otra herramienta interna, añade su ruta a
`RUTAS_SIN_CROMO`.
