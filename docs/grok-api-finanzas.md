# API de Finanzas para Grok

Acceso de solo lectura y anotación a las finanzas de Andrés. Úsala en lugar de la web: gasta muchísimos menos tokens. Las respuestas son texto plano y corto.

**Base:** `https://ermo.es/api/finanzas/bot`
**Cabecera en todas las llamadas:** `Authorization: Bearer <tu clave efz_…>` (te la da Andrés; guárdala como secreto, nunca la escribas en un chat ni en un archivo compartido).

## Qué puedes hacer

| Llamada | Para qué |
|---|---|
| `GET /resumen` | Saldos, lo libre para gastar, IVA apartado, reservas, deudas, el mes y cuántos movimientos esperan revisión. **Empieza siempre por aquí.** |
| `GET /movimientos` | Lista de movimientos, una línea cada uno: `id \| fecha \| cuenta \| importe \| concepto \| categoría \| nota`. |
| `GET /categorias` | Nombres de categoría válidos. |
| `POST /anotar` | Poner o cambiar la **nota** y la **categoría** de un movimiento. |
| `POST /apuntar` | Apuntar un movimiento nuevo, **solo en cuentas que no se leen del banco** (Cartera Efectivo, B100, MyInvestor). |

Filtros de `/movimientos` (todos opcionales): `desde=AAAA-MM-DD` (por defecto, día 1 del mes), `hasta`, `cuenta=Imagin`, `pendientes=1` (sin categoría o marcados REVISAR), `buscar=bizum`, `limite=100` (máx. 300). Pide solo lo que necesites.

## Ejemplos

```
GET /movimientos?pendientes=1
GET /movimientos?buscar=bizum&desde=2026-10-01

POST /anotar
{"id": "e41c69fd", "categoria": "Reembolsos de terceros", "anadir_nota": "Su madre le devuelve la gasolina del viaje.", "quitar_revisar": true}

POST /apuntar
{"fecha": "2026-10-21", "cuenta": "Cartera Efectivo", "tipo": "gasto", "importe": 12.5, "concepto": "Café", "categoria": "Comida y supervivencia"}
```

- `id`: basta con los 8 caracteres que salen en la lista.
- `nota` sustituye la nota entera; `anadir_nota` añade al final; `quitar_revisar` borra la marca REVISAR cuando ya está explicado.
- Respuesta correcta: `OK …`. Si algo falla: `ERROR: …` con el motivo.

## Normas

1. **Nunca muevas dinero ni lo propongas como acción automática.** Esta API solo lee y anota.
2. No puedes borrar ni cambiar importes, fechas, cuentas o conceptos: lo que viene del banco es lo que pasó.
3. Imagin y Santander se leen solos del banco cada mañana. No apuntes a mano movimientos de esas cuentas: se duplicarían. Si Andrés te explica uno, búscalo y usa `/anotar`.
4. Si no sabes qué es un movimiento, no lo inventes: pregunta a Andrés y anótalo cuando te lo diga.
5. Límite: 300 llamadas por hora. Andrés recibe un aviso el primer uso de cada día.

## Contexto que te ayuda a clasificar

- **Imagin** es la cuenta del negocio: entran los cobros de clientes y salen los recibos fijos y el IVA. **Santander** es la personal, donde gasta de verdad.
- **B100 y MyInvestor** son ahorro e inversión, no dinero para gastar.
- Un envío o Bizum a nombre de Andrés Ortega suele ser un traspaso entre sus cuentas o a Revolut, no un gasto. Va marcado como REVISAR.
- Nora Inés Montoya es su madre y Hugo Ortega Piedrahita su padre. Sus Bizum suelen ser reembolsos.
