// app/api/contact/route.js
import nodemailer from 'nodemailer';

export async function POST(req) {
    const { name, email } = await req.json();

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: 'andres03ortega@gmail.com, hola@soyandres.es',
            subject: 'ERMO petición contacto',
            text: `Nombre: ${name}\nEmail: ${email}`,
            html: `<b>Nombre:</b> ${name}<br><b>Email:</b> ${email}`,
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Email enviado correctamente' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Error al enviar', error: error.toString() }), { status: 500 });
    }
}
