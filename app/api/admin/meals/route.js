import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, description, price, category, image } = await request.json();
  try {
    const result = await pool.query(
      `INSERT INTO meals (name, description, price, image, category) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [name, description, price, image, category]
    );
    return NextResponse.json({ message: "Meal Added!", mealId: result.rows[0].id }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Database error." }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { id, name, description, price, category, image } = await request.json();
  try {
    await pool.query(
      `UPDATE meals SET name = $1, description = $2, price = $3, category = $4, image = $5 WHERE id = $6`,
      [name, description, price, category, image, id]
    );
    return NextResponse.json({ message: "Meal updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  try {
    await pool.query("DELETE FROM meals WHERE id = $1", [id]);
    return NextResponse.json({ message: "Meal Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
