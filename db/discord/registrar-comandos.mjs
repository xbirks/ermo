// Registra /nota y /gasto en el servidor de Discord.
//
// Se ejecuta una sola vez a mano (o cada vez que cambien los
// comandos), no forma parte de la app: nadie más que Andrés necesita
// lanzar esto.
//
//   DISCORD_APPLICATION_ID=... DISCORD_BOT_TOKEN=... DISCORD_GUILD_ID=... \
//     node db/discord/registrar-comandos.mjs
//
// Con DISCORD_GUILD_ID los comandos aparecen al momento, sólo en ese
// servidor. Sin él, Discord los registra en global y tarda hasta una
// hora en propagarlos a todos los servidores donde esté la app.

const APP_ID = process.env.DISCORD_APPLICATION_ID;
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

if (!APP_ID || !TOKEN) {
    console.error('Faltan DISCORD_APPLICATION_ID o DISCORD_BOT_TOKEN.');
    process.exit(1);
}

const comandos = [
    {
        name: 'nota',
        description: 'Guarda una nota de contexto para Claude',
        options: [
            {
                name: 'texto',
                description: 'Qué quieres apuntar',
                type: 3, // STRING
                required: true,
            },
        ],
    },
    {
        name: 'gasto',
        description: 'Apunta un gasto',
        options: [
            {
                name: 'importe',
                description: 'Cuánto ha costado',
                type: 10, // NUMBER
                required: true,
            },
            {
                name: 'concepto',
                description: 'En qué ha sido',
                type: 3, // STRING
                required: true,
            },
            {
                name: 'cuenta',
                description: 'De qué cuenta sale (por defecto, Santander)',
                type: 3, // STRING
                required: false,
                choices: [
                    { name: 'Santander', value: 'Santander' },
                    { name: 'Imagin', value: 'Imagin' },
                    { name: 'Efectivo', value: 'Cartera Efectivo' },
                ],
            },
        ],
    },
];

const url = GUILD_ID
    ? `https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands`
    : `https://discord.com/api/v10/applications/${APP_ID}/commands`;

const res = await fetch(url, {
    method: 'PUT',
    headers: {
        Authorization: `Bot ${TOKEN}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(comandos),
});

if (!res.ok) {
    console.error('Fallo al registrar:', res.status, await res.text());
    process.exit(1);
}

const creados = await res.json();
console.log(`Registrados ${creados.length} comandos:`, creados.map((c) => `/${c.name}`).join(', '));
