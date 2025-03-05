import fs from "node:fs/promises";

import bodyParser from "body-parser";

import "dotenv/config";
import express from "express";
import pkg from "pg";
import cors from "cors";

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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// app.get("/meals", async (req, res) => {
//   const meals = await fs.readFile("./data/available-meals.json", "utf8");
//   res.json(JSON.parse(meals));
// });

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
      `INSERT INTO orders (id, customer_email, customer_name, street, city, postal_code, items) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        orderId,
        email,
        name,
        street,
        city,
        postalCode,
        JSON.stringify(orderData.items), // Store items as JSON
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

app.get("/fetch-orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// app.post("/orders", async (req, res) => {
//   const orderData = req.body.order;

//   if (
//     orderData === null ||
//     orderData.items === null ||
//     orderData.items.length === 0
//   ) {
//     return res.status(400).json({ message: "Missing data." });
//   }

//   if (
//     orderData.customer.email === null ||
//     !orderData.customer.email.includes("@") ||
//     orderData.customer.name === null ||
//     orderData.customer.name.trim() === "" ||
//     orderData.customer.street === null ||
//     orderData.customer.street.trim() === "" ||
//     orderData.customer["postal-code"] === null ||
//     orderData.customer["postal-code"].trim() === "" ||
//     orderData.customer.city === null ||
//     orderData.customer.city.trim() === ""
//   ) {
//     return res.status(400).json({
//       message:
//         "Missing data: Email, name, street, postal code or city is missing.",
//     });
//   }

//   const newOrder = {
//     ...orderData,
//     id: (Math.random() * 1000).toString(),
//   };
//   const orders = await fs.readFile("./data/orders.json", "utf8");
//   const allOrders = JSON.parse(orders);
//   allOrders.push(newOrder);
//   await fs.writeFile("./data/orders.json", JSON.stringify(allOrders));
//   res.status(201).json({ message: "Order created!" });
// });

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

app.listen(3000);
