import pool from "@/lib/db";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { resetPasswordTemplate } from "@/util/resetPasswordEmailTemplate";

export async function POST(request) {
  const { email } = await request.json();

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await pool.query(
      `UPDATE users SET reset_token=$1, reset_token_expiry=NOW() + INTERVAL '15 minutes' WHERE email=$2`,
      [hashedToken, email],
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Foodie Support" <${process.env.EMAIL}>`,
      to: email,
      subject: "Reset your password",
      html: resetPasswordTemplate(email, resetLink),
    });

    return NextResponse.json({ message: "Reset link sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 },
    );
  }
}
