import pool from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, password } = await request.json();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE reset_token=$1 AND reset_token_expiry > NOW()",
      [hashedToken]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "UPDATE users SET password=$1, reset_token=NULL, reset_token_expiry=NULL WHERE reset_token=$2",
      [hashedPassword, hashedToken]
    );

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
