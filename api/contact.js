// Vercel Serverless Function — Contact Form Handler
// Sends email via Resend when someone submits the contact form
// Env vars needed in Vercel: RESEND_API_KEY, NOTIFY_EMAIL (recipient)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, service } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL || 'peter@flowst8.eu';

  if (!apiKey) {
    console.error('RESEND_API_KEY not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const serviceLabel = service ? `\nKurs/Anfrage: ${service}` : '';
  const phoneLabel = phone ? `\nTelefon: ${phone}` : '';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Fly Fishing Experience <noreply@flyfishingexperience.de>',
        to: [notifyEmail],
        reply_to: email,
        subject: `Neue Buchungsanfrage — ${name}`,
        text: `Neue Kontaktanfrage über flyfishingexperience.de

Name: ${name}
E-Mail: ${email}${phoneLabel}${serviceLabel}

Nachricht:
${message}

---
Direkt antworten: ${email}
`,
        html: `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f7f2; border: 1px solid #d4c5a0;">
  <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; border-bottom: 2px solid #2c2c2c; padding-bottom: 8px; margin-bottom: 20px;">
    Neue Buchungsanfrage
  </h2>
  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 6px 0; color: #666; width: 100px;">Name</td><td style="padding: 6px 0;"><strong>${name}</strong></td></tr>
    <tr><td style="padding: 6px 0; color: #666;">E-Mail</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #2c2c2c;">${email}</a></td></tr>
    ${phone ? `<tr><td style="padding: 6px 0; color: #666;">Telefon</td><td style="padding: 6px 0;">${phone}</td></tr>` : ''}
    ${service ? `<tr><td style="padding: 6px 0; color: #666;">Kurs</td><td style="padding: 6px 0;">${service}</td></tr>` : ''}
  </table>
  <div style="margin-top: 20px; padding: 16px; background: #fff; border-left: 3px solid #2c2c2c;">
    <p style="color: #666; font-size: 12px; margin: 0 0 8px;">Nachricht:</p>
    <p style="margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
  </div>
  <div style="margin-top: 20px; text-align: center;">
    <a href="mailto:${email}" style="background: #2c2c2c; color: #fff; padding: 10px 24px; text-decoration: none; font-family: monospace; font-size: 13px; letter-spacing: 1px;">ANTWORTEN</a>
  </div>
  <p style="margin-top: 20px; font-size: 11px; color: #999; text-align: center;">Fly Fishing Experience Munich — flyfishingexperience.de</p>
</div>
`,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
