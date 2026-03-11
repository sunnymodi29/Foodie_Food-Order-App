import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const {
    user_id,
    username,
    email,
    password,
    new_password,
    addresses,
    currency_code,
  } = await request.json();

  if (!email || !email.includes("@") || !username) {
    return NextResponse.json({ message: "Invalid input." }, { status: 400 });
  }

  let hashedPassword;
  const existing = await pool.query("SELECT password FROM users WHERE id = $1", [user_id]);
  const currentHash = existing.rows[0]?.password;

  if (new_password && new_password !== password) {
    hashedPassword = await bcrypt.hash(new_password, 10);
  } else {
    hashedPassword = currentHash;
  }

  try {
    await pool.query(
      `UPDATE users SET username = $2, email = $3, password = $4, addresses = $5, currency_code = $6 WHERE id = $1`,
      [user_id, username, email, hashedPassword, addresses, currency_code]
    );

    return NextResponse.json({
      message: "Profile Edited Successfully!",
      userId: user_id,
      currency_code: currency_code,
      passwordChanged: (new_password && new_password !== password)
    }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ message: "Database error." }, { status: 500 });
  }
}
