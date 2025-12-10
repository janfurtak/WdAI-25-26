const express = require("express");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const ORDERS_FILE = "./orders.json";
const JWT_SECRET = "super_secret_key";

function loadOrders() {
  return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
}

function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// --- Middleware JWT ---
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Brak tokena" });

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Niepoprawny token" });
  }
}

// --- GET ALL ORDERS ---
app.get("/api/orders", (req, res) => {
  res.json(loadOrders());
});

// --- GET BY ID ---
app.get("/api/orders/:orderId", (req, res) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === req.params.orderId);

  if (!order)
    return res.status(404).json({ message: "Zamówienie nie istnieje" });

  res.json(order);
});

// --- CREATE ORDER (JWT required) ---
app.post("/api/orders", auth, (req, res) => {
  const { bookId, quantity } = req.body;

  const orders = loadOrders();
  const newOrder = {
    id: uuid(),
    userId: req.user.id,
    bookId,
    quantity,
    date: new Date().toISOString(),
  };

  orders.push(newOrder);
  saveOrders(orders);

  res.status(201).json(newOrder);
});

// --- PATCH ORDER (JWT required) ---
app.patch("/api/orders/:orderId", auth, (req, res) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === req.params.orderId);

  if (!order)
    return res.status(404).json({ message: "Zamówienie nie istnieje" });

  if (order.userId !== req.user.id)
    return res.status(403).json({ message: "Brak uprawnień" });

  const { bookId, quantity } = req.body;

  if (bookId !== undefined) order.bookId = bookId;
  if (quantity !== undefined) order.quantity = quantity;

  saveOrders(orders);
  res.json(order);
});

// --- DELETE ORDER (JWT required) ---
app.delete("/api/orders/:orderId", auth, (req, res) => {
  const orders = loadOrders();
  const order = orders.find((o) => o.id === req.params.orderId);

  if (!order)
    return res.status(404).json({ message: "Zamówienie nie istnieje" });

  if (order.userId !== req.user.id)
    return res.status(403).json({ message: "Brak uprawnień" });

  const newOrders = orders.filter((o) => o.id !== req.params.orderId);
  saveOrders(newOrders);

  res.json({ message: "Usunięto" });
});

// --- START ---
app.listen(3002, () => console.log("Orders service running on port 3002"));
