export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing transaction id' });

  try {
    const response = await fetch(`https://nexuspag.com/api/pix/${encodeURIComponent(id)}`, {
      headers: {
        'x-api-key': process.env.NEXUSPAG_API_KEY,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
}
