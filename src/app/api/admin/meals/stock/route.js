import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  const { mealId, inStock } = await request.json();
  try {
    await pool.query(`UPDATE meals SET "inStock" = $1 WHERE id = $2`, [inStock, mealId]);
    return NextResponse.json({ message: "Stock status updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
