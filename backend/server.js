const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Placeholder for future database integration
const DB = {
  orders: []
};

app.post('/api/orders', (req, res) => {
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
    createdAt: new Date()
  };

  DB.orders.push(newOrder);

  // Simulating processing delay
  setTimeout(() => {
    res.status(201).json({ message: 'Pedido realizado com sucesso!', order: newOrder });
  }, 1000);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'The Sweet Scoop API is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
