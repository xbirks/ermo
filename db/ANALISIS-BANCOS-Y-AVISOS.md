# Conectar los bancos y avisar por Telegram

Análisis previo, con los datos verificados el 31 de julio de 2026. No
hay nada construido todavía: esto es para decidir si merece la pena y
en qué orden.

---

## 1. Conectar los bancos

### Qué proveedor

**Enable Banking.** Es el único que permite a un particular conectar
sus propias cuentas sin licencia bancaria ni contrato.

GoCardless (antes Nordigen) era la opción obvia hasta hace poco, pero
cerró el registro y está retirando su nivel gratuito. Tink, Plaid y
TrueLayer son de pago y orientados a empresas.

### Qué hace falta y qué no

Enable Banking tiene dos vías, y conviene no confundirlas:

| | Producción normal | **Producción restringida** |
|---|---|---|
| Licencia TPP | sí | **no** |
| Certificados eIDAS | sí | **no** |
| Contrato firmado | sí | **no** |
| Coste | de pago | **gratis** |
| A qué cuentas llega | a las de cualquiera | **sólo a las que enlaces tú** |

La restringida es la que aplica: se registra una aplicación, se enlazan
las cuentas propias desde el portal, y la API sólo devuelve esas. Ni
siquiera comprueba los textos legales, porque no hay terceros
implicados.

### Cobertura de tus cuentas

| Cuenta | Entidad | Soportada |
|---|---|---|
| Imagin | CaixaBank | sí |
| Santander | Santander | sí |
| B100 | BBVA | sí (como BBVA) |
| MyInvestor | — | **no** |

MyInvestor es un bróker, no un banco bajo PSD2. Su saldo seguirá
poniéndose a mano, como ahora. Tampoco sabemos si B100 aparecerá como
cuenta propia o dentro de BBVA, ni si la Hucha se verá por separado.

### Las tres limitaciones que hay que aceptar

**Reautorizar cada 90 días.** Lo impone la normativa, no el proveedor.
Cuatro veces al año habrá que entrar en cada banco y volver a dar
permiso. Si se pasa la fecha, la conexión deja de traer datos hasta que
se renueve.

**Sólo 90 días de historial.** Al autorizar por primera vez, algunos
bancos dan el histórico completo durante la primera hora; después se
limitan a los últimos 90 días. Los tres años que ya están importados no
se pierden, pero conviene no borrarlos.

**Una sesión por banco.** Los bancos españoles que usan Redsys sólo
admiten una autenticación activa por usuario, así que reautorizar
invalida la sesión anterior.

### Qué cambiaría en la práctica

Lo que se gana:

- Los movimientos entran solos, sin descargar extractos ni importarlos
- Los saldos dejan de ponerse a mano en Imagin y Santander
- Se pueden detectar cargos nuevos y avisar de ellos

Lo que **no** resuelve:

- La clasificación sigue siendo manual o por reglas. El banco dice
  «PAGO MOVIL EN 329302699 CONSU», no «compra en el supermercado».
- Los traspasos entre cuentas propias siguen necesitando criterio: la
  API no sabe que «Compra» en Imagin es dinero que va a Santander.
- El IVA, el dinero apartado y el reparto son decisiones, no datos.

Dicho claro: **la conexión ahorra teclear, no ahorra pensar.** El valor
de esta app está en lo segundo.

### Cómo se haría

1. Registrar la aplicación en Enable Banking y descargar su clave
   privada. Va a variables de entorno, nunca al repositorio.
2. Enlazar las cuentas desde su portal, autorizando en cada banco.
3. Una ruta que pida los movimientos nuevos y los meta en la base
   reutilizando el importador que ya existe (`db/importar/`), con su
   detección de duplicados y sus reglas de clasificación.
4. Una tarea programada que la llame una vez al día.
5. Un aviso en la app cuando falten menos de siete días para que caduque
   una autorización.

El importador ya está escrito y probado, así que el trabajo real es la
autenticación y el mapeo de los datos que devuelve la API.

**Estimación: dos o tres sesiones.** La mayor incertidumbre es cómo
aparecen B100 y la Hucha.

---

## 2. Avisos por Telegram

### Telegram frente a Discord

**Telegram**, sin dudarlo. Se crea un bot hablando con @BotFather, se
guardan dos datos —el token y el identificador del chat— y ya se pueden
enviar mensajes con una llamada HTTP. Sin servidor, sin webhooks, sin
alojar nada.

Discord necesita un servidor propio y su webhook, y los mensajes se
leen peor en el móvil.

### Qué avisar

De más a menos útil, en mi opinión:

**El día 1 de cada mes.** Qué recibos van a salir y de qué cuenta.
Sirve para comprobar que hay saldo antes de que lleguen.

**Cuando una cuenta baje de un umbral.** Por ejemplo, Santander por
debajo de 100 €. Es el aviso que evita un descubierto.

**Antes de cada trimestre de IVA.** Diez días antes del 20 de enero,
abril, julio y octubre, recordando cuánto hay retenido y cuánto habrá
que pagar.

**Un resumen mensual.** El día 1: qué entró, qué salió y qué quedó el
mes anterior.

**Cuando caduque una autorización bancaria.** Sólo tiene sentido si se
conectan los bancos.

### Cómo se haría

Vercel permite programar tareas (cron jobs) en el plan gratuito, con un
límite de una ejecución diaria. Suficiente: una ruta protegida que se
ejecute cada mañana, mire qué hay que avisar y mande el mensaje.

Hace falta una tabla pequeña para no repetir el mismo aviso dos veces.

**Estimación: una sesión.** Es mucho más sencillo que lo de los bancos.

---

## 3. En qué orden

Los avisos primero, aunque los bancos sean lo que más interesa:

1. Se hacen en una sesión y empiezan a servir desde el primer día.
2. No dependen de nada externo.
3. La parte más útil —recibos que vienen, IVA del trimestre— funciona
   con los datos que ya hay.

Y hay una razón de fondo: la app lleva pocos días en uso. Conectar los
bancos automatiza la entrada de datos, pero si la clasificación o los
traspasos todavía necesitan ajustes, automatizar la entrada multiplica
el trabajo de corregir en lugar de reducirlo.

Un par de semanas de uso normal dirán qué reglas fallan. Con eso
afinado, la conexión sí ahorra tiempo de verdad.
