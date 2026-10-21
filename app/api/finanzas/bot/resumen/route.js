import { exigirClave, texto } from '@/app/lib/finanzas/acceso';
import { sql } from '@/app/lib/finanzas/db';
import { getCuentas, getIvaPorTrimestre, getReservas } from '@/app/lib/finanzas/consultas';
import { estadoConexiones } from '@/app/lib/finanzas/banco';
import { eur } from '@/app/lib/finanzas/bot';

export const dynamic = 'force-dynamic';

const horaMadrid = (v) => new Date(v).toLocaleString('es-ES', {
    timeZone: 'Europe/Madrid', day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit',
});

/**
 * GET /api/finanzas/bot/resumen
 *
 * La foto entera en unas 15 líneas: saldos, lo libre, IVA apartado,
 * reservas, deudas, cómo va el mes y cuántos movimientos esperan
 * revisión. Es lo primero que debería pedir el asistente.
 */
export async function GET(request) {
    const acceso = await exigirClave(request, 'leer');
    if (acceso.respuesta) return acceso.respuesta;

    try {
        const [cuentas, trimestres, reservas, bancos, deudas, [mes], [pend]] = await Promise.all([
            getCuentas(),
            getIvaPorTrimestre(),
            getReservas(),
            estadoConexiones(),
            sql`SELECT concepto, pendiente FROM deudas ORDER BY pendiente DESC`,
            sql`
                SELECT
                    COALESCE(sum(t.importe) FILTER (WHERE t.tipo_movimiento = 'ingreso' AND NOT COALESCE(c.fuera_de_cascada, false)), 0) AS ingresos,
                    COALESCE(sum(t.importe) FILTER (WHERE t.tipo_movimiento = 'gasto' AND NOT COALESCE(c.fuera_de_cascada, false)), 0) AS gastos
                FROM transacciones t LEFT JOIN categorias c ON c.id = t.categoria_id
                WHERE t.fecha >= date_trunc('month', CURRENT_DATE)`,
            sql`
                SELECT count(*) AS n FROM transacciones
                WHERE fecha >= CURRENT_DATE - 60
                  AND ((categoria_id IS NULL AND tipo_movimiento <> 'transferencia_interna')
                       OR notas ~* '(REVISAR|SIN IDENTIFICAR)')`,
        ]);

        const banco = Object.fromEntries(bancos.map((b) => [b.cuenta, b]));
        const lineas = [
            `FINANZAS · ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}`,
            'CUENTAS (saldo · libre)',
        ];
        for (const c of cuentas) {
            const b = banco[c.nombre];
            const origen = b?.conectada
                ? ` [banco, leído ${b.ultima_lectura ? horaMadrid(b.ultima_lectura) : 'nunca'}]`
                : ' [manual]';
            const libre = c.disponible !== c.saldo_actual ? ` · ${eur(c.disponible)}` : '';
            lineas.push(`${c.nombre} (${c.tipo}): ${eur(c.saldo_actual)}${libre}${origen}`);
        }
        const libre = cuentas.filter((c) => ['corriente', 'efectivo'].includes(c.tipo)).reduce((s, c) => s + c.disponible, 0);
        const ahorro = cuentas.filter((c) => ['ahorro', 'inversion'].includes(c.tipo)).reduce((s, c) => s + c.disponible, 0);
        lineas.push(`LIBRE PARA GASTAR: ${eur(libre)} · AHORRO E INVERSIÓN: ${eur(ahorro)}`);

        const iva = trimestres.filter((t) => t.pendiente > 0);
        lineas.push(`IVA APARTADO: ${iva.length ? iva.map((t) => `${t.trimestre_fiscal} ${eur(t.pendiente)}`).join(' · ') : 'nada'}`);
        const activas = reservas.filter((r) => r.estado === 'activa');
        lineas.push(`RESERVAS: ${activas.length ? activas.map((r) => `${r.concepto} ${eur(r.importe)}`).join(' · ') : 'ninguna'}`);
        lineas.push(`DEUDAS: ${deudas.length ? deudas.map((d) => `${d.concepto} ${eur(d.pendiente)}`).join(' · ') : 'ninguna'}`);
        lineas.push(`ESTE MES: ingresos ${eur(mes.ingresos)} · gastos ${eur(mes.gastos)}`);
        lineas.push(`POR REVISAR (60 días): ${pend.n} → GET /api/finanzas/bot/movimientos?pendientes=1`);

        return texto(lineas.join('\n'));
    } catch (error) {
        console.error('[bot/resumen]', error);
        return texto('ERROR: no se ha podido leer el resumen', 500);
    }
}
