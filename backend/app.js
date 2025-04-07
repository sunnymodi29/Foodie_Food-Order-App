import fs from "node:fs/promises";

import bodyParser from "body-parser";

import "dotenv/config";
import express from "express";
import pkg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon
});

app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST", "OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/meals", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM meals");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/orders", async (req, res) => {
  const orderData = req.body;

  const orderId = Math.floor(Math.random() * 1000000).toString(); // Generate random ID

  // ✅ Validate order details
  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: "Missing order items." });
  }

  const {
    name,
    email,
    street,
    city,
    "postal-code": postalCode,
  } = orderData.customer;
  if (
    !email ||
    !email.includes("@") ||
    !name ||
    !street ||
    !city ||
    !postalCode
  ) {
    return res.status(400).json({
      message: "Missing required customer information.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (id, customer_email, customer_name, street, city, postal_code, items, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        orderId,
        email,
        name,
        street,
        city,
        postalCode,
        JSON.stringify(orderData.items), // Store items as JSON
        orderData.user_id,
      ]
    );

    res
      .status(201)
      .json({ message: "Order created!", orderId: result.rows[0].id });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error." });
  }
});

app.get("/fetch-orders/:user", async (req, res) => {
  const userId = req.params.user;

  try {
    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
      userId,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !email.includes("@") || !username || !password) {
    return res.status(400).json({ message: "Invalid input." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password) 
       VALUES ($1, $2, $3) RETURNING id`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User created!",
      user: { username, email, password: hashedPassword, addresses: "" },
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid input." });
  }

  try {
    // Check if user exists
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found." });
    }

    const user = result.rows[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.json({ message: "Login successful!", user: user });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error." });
  }
});

app.post("/editprofile", async (req, res) => {
  const { user_id, username, email, password, new_password, addresses } =
    req.body;

  if (!email || !email.includes("@") || !username) {
    return res.status(400).json({ message: "Invalid input." });
  }

  let hashedPassword;

  // Always hash the new password, or keep the existing hashed one if not changed
  if (new_password && new_password !== password) {
    hashedPassword = await bcrypt.hash(new_password, 10);
  } else {
    // Fetch the user's existing hashed password from the database
    const existing = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [user_id]
    );
    hashedPassword = existing.rows[0]?.password;
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $2,
           email = $3,
           password = $4,
           addresses = $5
       WHERE id = $1
       RETURNING id`,
      [user_id, username, email, hashedPassword, addresses]
    );

    let response = {
      message: "Profile Edited Successfully!",
      userId: user_id,
    };

    if (new_password && new_password !== password) {
      response.passwordChanged = true;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error." });
  }
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

app.listen(3000);
