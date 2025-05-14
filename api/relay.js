export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const SECRET = process.env.SECRET_KEY;
  if (SECRET && req.headers['x-api-key'] !== SECRET) {
    return res.status(403).send('Forbidden');
  }

  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return res.status(500).send('Webhook not configured');

  const discordRes = await fetch(webhook, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(req.body)
  });

  if (!discordRes.ok) {
    return res.status(500).send('Failed to relay');
  }

  res.status(200).send('OK');
}
