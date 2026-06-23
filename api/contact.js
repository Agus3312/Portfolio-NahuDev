const nodemailer = require('nodemailer');

/**
 * Vercel serverless function — POST /api/contact
 * Receives contact form data, validates required fields,
 * and sends an email notification via SMTP.
 *
 * Required env vars (set in Vercel dashboard):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_TO
 */

function formatEmailBody(data) {
  const fields = [];

  if (data.nombre) fields.push(`Nombre: ${data.nombre}`);
  if (data.telefono) fields.push(`Teléfono: ${data.telefono}`);
  if (data.email) fields.push(`Email: ${data.email}`);

  if (data.chips && data.chips.length) {
    fields.push(`Intereses: ${data.chips.join(', ')}`);
  }

  if (data.service) {
    const labels = {
      web: 'Sitio web completo',
      landing: 'Landing page',
      chatbot: 'Chatbot',
      automatizacion: 'Automatización',
      dashboard: 'Dashboard / reportes',
      reservas: 'Sistema de turnos',
      'nosé': 'No sé todavía',
    };
    fields.push(`Servicio: ${labels[data.service] || data.service}`);
  }

  if (data.presencia) {
    const labels = {
      no: 'Sin presencia digital',
      redes: 'Solo redes sociales',
      'web-vieja': 'Web desactualizada',
      'web-ok': 'Web funcionando',
    };
    fields.push(`Presencia digital: ${labels[data.presencia] || data.presencia}`);
  }

  if (data.rubro) fields.push(`Rubro del negocio: ${data.rubro}`);

  if (data.objetivos && data.objetivos.length) {
    fields.push(`Objetivos: ${data.objetivos.join(', ')}`);
  }

  if (data.budget) fields.push(`Presupuesto aprox.: ${data.budget}`);
  if (data.detalle) fields.push(`Detalle adicional: ${data.detalle}`);
  if (data.mensaje) fields.push(`Mensaje: ${data.mensaje}`);

  if (data.urgency) {
    const labels = {
      flexible: 'Sin apuro',
      '1mes': 'Próximo mes',
      '2semanas': 'En 2 semanas',
      ya: 'Lo antes posible',
    };
    fields.push(`Urgencia: ${labels[data.urgency] || data.urgency}`);
  }

  return [
    '📬 Nuevo mensaje de contacto — NahuDev',
    '═══════════════════════════════════',
    '',
    ...fields,
    '',
    '═══════════════════════════════════',
    'Este mail fue generado automáticamente desde nahudev.com.ar',
  ].join('\n');
}

module.exports = async function handler(req, res) {
  // ── CORS headers ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ── Preflight ──
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // ── Method guard ──
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // ── Parse & validate ──
  const { nombre, telefono, email } = req.body || {};

  if (!nombre || !telefono || !email) {
    res.status(400).json({
      error: 'Faltan campos requeridos: nombre, teléfono y email.',
    });
    return;
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: 'El email no tiene un formato válido.' });
    return;
  }

  // ── SMTP transporter ──
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.EMAIL_TO) {
    console.error('Missing SMTP environment variables');
    res.status(500).json({ error: 'Error de configuración del servidor.' });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true for 465, false for other ports (587 uses STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"NahuDev Contacto" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Nuevo contacto desde NahuDev — ${nombre}`,
      text: formatEmailBody(req.body),
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Intentá de nuevo en unos minutos.' });
  }
};
