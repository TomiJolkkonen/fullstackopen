const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let items = [
  { id: 1, content: 'First item' },
  { id: 2, content: 'Second item' },
];

app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const item = req.body;
  item.id = items.length + 1;
  items.push(item);
  res.status(201).json(item);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
