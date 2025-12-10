const express = require("express");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const BOOKS_FILE = "./books.json";
const JWT_SECRET = "super_secret_key";

function loadBooks() {
  return JSON.parse(fs.readFileSync(BOOKS_FILE, "utf8"));
}

function saveBooks(books) {
  fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2));
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

// --- GET ALL BOOKS ---
app.get("/api/books", (req, res) => {
  res.json(loadBooks());
});

// --- GET BY ID ---
app.get("/api/books/:id", (req, res) => {
  const books = loadBooks();
  const book = books.find((b) => b.id === req.params.id);

  if (!book) return res.status(404).json({ message: "Książka nie istnieje" });
  res.json(book);
});

// --- ADD BOOK (JWT required) ---
app.post("/api/books", auth, (req, res) => {
  const books = loadBooks();
  const { title, author, price } = req.body;

  const newBook = { id: uuid(), title, author, price };
  books.push(newBook);

  saveBooks(books);
  res.status(201).json(newBook);
});

// --- UPDATE BOOK (JWT + PATCH) ---
app.patch("/api/books/:id", auth, (req, res) => {
  const books = loadBooks();
  const book = books.find((b) => b.id === req.params.id);

  if (!book) return res.status(404).json({ message: "Książka nie istnieje" });

  const { title, author, price } = req.body;

  if (title !== undefined) book.title = title;
  if (author !== undefined) book.author = author;
  if (price !== undefined) book.price = price;

  saveBooks(books);
  res.json(book);
});

// --- DELETE BOOK ---
app.delete("/api/books/:id", auth, (req, res) => {
  const books = loadBooks();
  const newBooks = books.filter((b) => b.id !== req.params.id);

  if (books.length === newBooks.length)
    return res.status(404).json({ message: "Książka nie istnieje" });

  saveBooks(newBooks);

  res.json({ message: "Usunięto" });
});

// --- START ---
app.listen(3001, () => console.log("Books service running on port 3001"));
