import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, email, password } = await request.json();

  if (!email || !email.includes("@") || !username || !password) {
    return NextResponse.json({ message: "Invalid input." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`,
      [username, email, hashedPassword]
    );

    return NextResponse.json({
      message: "User created!",
      user: { id: result.rows[0].id, username, email, password: hashedPassword, addresses: "", admin: false },
    }, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error." }, { status: 500 });
  }
}
