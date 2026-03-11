import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    const userRes = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    const user = userRes.rows[0];

    let result;
    if (user?.admin) {
      result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    } else {
      result = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    }

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
