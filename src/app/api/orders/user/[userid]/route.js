import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { userid } = await params;

  try {
    const result = await pool.query(
      `
      SELECT o.*, u.admin
      FROM orders o
      JOIN users u ON u.id = $1
      WHERE u.admin = true OR o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [userid],
    );

    const ordersWithTotal = result.rows.map((order) => {
      const total = Array.isArray(order.items)
        ? order.items.reduce(
            (sum, item) => sum + Number(item.price) * item.quantity,
            0,
          )
        : 0;

      return { ...order, total };
    });

    return NextResponse.json(ordersWithTotal);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
