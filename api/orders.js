export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { flavor, quantity, customer } = req.body;

  if (!flavor || !quantity) {
    return res.status(400).json({ error: 'Faltam dados do pedido.' });
  }

  const newOrder = {
    id: Date.now().toString(),
    flavor,
    quantity,
    customer: customer || 'Anônimo',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({ message: 'Pedido realizado com sucesso!', order: newOrder });
}
