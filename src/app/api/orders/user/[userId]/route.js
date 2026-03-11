import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { userId } = await params;

  try {
    const result = await pool.query(
      `
      SELECT o.*, u.admin
      FROM orders o
      JOIN users u ON u.id = $1
      WHERE u.admin = true OR o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [userId],
    );

    const ordersWithTotal = result.rows.map((order) => {
      let total = 0;
      const items = order.items;

      if (Array.isArray(items)) {
        items.forEach((item) => {
          total += parseFloat(item.price) * item.quantity;
        });
      }

      return { ...order, total: Number(total.toFixed()) };
    });

    return NextResponse.json(ordersWithTotal);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
