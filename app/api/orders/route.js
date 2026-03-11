import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC",
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const orderData = await request.json();
  const orderId = Math.floor(Math.random() * 1000000).toString();

  if (!orderData?.items?.length) {
    return NextResponse.json(
      { message: "Missing order items." },
      { status: 400 },
    );
  }

  const { name, email, street, city, postal_code } = orderData.customer;
  if (!email || !name || !street || !city || !postal_code) {
    return NextResponse.json(
      { message: "Missing customer info." },
      { status: 400 },
    );
  }

  try {
    await pool.query(
      `INSERT INTO orders (id, customer_email, customer_name, street, city, postal_code, items, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        orderId,
        email,
        name,
        street,
        city,
        postal_code,
        JSON.stringify(orderData.items),
        orderData.user_id,
      ],
    );

    return NextResponse.json(
      { message: "Order created!", orderId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error." }, { status: 500 });
  }
}
