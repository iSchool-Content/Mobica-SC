const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const menu = [
  { id: 1, name: "Cheesy Byte Burger", price: 8.99 },
  { id: 2, name: "Fries of Fury", price: 3.49 },
  { id: 3, name: "API Latte", price: 4.75 },
  { id: 4, name: "Node Nuggets", price: 5.25 }
];
app.get('/', (req, res) => {
  res.send("Welcome to ByteBites API Serving Data with Flavor!");
});

app.get('/menu', (req, res) => {
  res.json(menu);
});

app.get('/menu/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = menu.find((m) => m.id === itemId);

  if (!item) {
    return res.status(404).json({ error: "Menu item not found." });
  }

  res.json(item);
});

app.post('/order', (req, res) => {
  const { customerName, itemId } = req.body;
  const item = menu.find((m) => m.id === itemId);

  if (!customerName || !item) {
    return res.status(400).json({ error: "Invalid order data." });
  }

  res.json({
    message: `Order received! Thanks, ${customerName}. Enjoy your ${item.name}!`,
    item: item
  });
});


app.listen(3000, () => {
  console.log("Server is running successfully");
});
