export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, description, order_id } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ error: 'Valor mínimo é R$1,00' });
  }

  try {
    const response = await fetch('https://nexuspag.com/api/pix/create', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NEXUSPAG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        description: description || 'Pedido Pizzaria Napoli',
        external_id: order_id || `pedido-${Date.now()}`,
        expiration: 1800,
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar cobrança PIX' });
  }
}
