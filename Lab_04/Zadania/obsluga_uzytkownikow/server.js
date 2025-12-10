const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.json());

const USERS_FILE = "./users.json";
const JWT_SECRET = "super_secret_key";

function loadUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --- REGISTER ---
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email i hasło są wymagane" });

  const users = loadUsers();

  if (users.some((u) => u.email === email))
    return res.status(409).json({ message: "Użytkownik już istnieje" });

  const hashed = await bcrypt.hash(password, 10);

  const newUser = {
    id: uuid(),
    email,
    password: hashed,
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ id: newUser.id });
});

// --- LOGIN ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const users = loadUsers();
  const user = users.find((u) => u.email === email);

  if (!user)
    return res.status(401).json({ message: "Niepoprawny email lub hasło" });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(401).json({ message: "Niepoprawny email lub hasło" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// --- Start ---
app.listen(3003, () => {
  console.log("Users service running on port 3003");
});
