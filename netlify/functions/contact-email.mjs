import 'dotenv/config';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function sendJson(statusCode, body) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: JSON_HEADERS,
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return new Response(null, { status: 204, headers: JSON_HEADERS });
  }

  if (event.httpMethod !== 'POST') {
    return sendJson(405, { message: 'Method not allowed' });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const fullName = String(body.fullName ?? '').trim();
    const email = String(body.email ?? '').trim();
    const phone = String(body.phone ?? '').trim();
    const travelDates = String(body.travelDates ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!fullName || !email || !message) {
      return sendJson(400, { message: 'Name, email and message are required.' });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const toEmail = process.env.BREVO_TO_EMAIL || 'hello@explora-riviera.com';
    const fromEmail = process.env.BREVO_FROM_EMAIL || 'noreply@explora-riviera.com';
    const senderName = process.env.BREVO_FROM_NAME || 'Explora Riviera';

    if (!apiKey) {
      return sendJson(500, { message: 'BREVO_API_KEY is not configured.' });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #12313d;">
        <h2 style="margin-bottom: 12px;">New contact enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
        <p><strong>Travel dates:</strong> ${escapeHtml(travelDates || 'Not provided')}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 12px 14px; background: #f6f7f7; border-radius: 8px;">${escapeHtml(message).replace(/\n/g, '<br />')}</div>
      </div>
    `;

    const payload = {
      sender: { email: fromEmail, name: senderName },
      to: [{ email: toEmail, name: 'Explora Riviera' }],
      replyTo: { email, name: fullName },
      subject: `New enquiry from ${fullName}`,
      htmlContent: html,
      textContent: [
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone || 'Not provided'}`,
        `Travel dates: ${travelDates || 'Not provided'}`,
        '',
        'Message:',
        message,
      ].join('\n'),
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.text();

    if (!response.ok) {
      console.error('Brevo email send failed:', result);
      return sendJson(502, {
        message: 'The email service is currently unavailable. Please send a WhatsApp message instead.',
      });
    }

    return sendJson(200, { message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Contact email handler failed:', error);
    return sendJson(500, {
      message: 'We could not process your request right now. Please contact us on WhatsApp instead.',
    });
  }
}

export default { handler };
