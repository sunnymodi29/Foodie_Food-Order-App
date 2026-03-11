import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await pool.connect();

    const countResult = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM orders) AS total_orders
    `);
    const { total_users, total_orders } = countResult.rows[0];

    const revenueResult = await client.query(`
      SELECT SUM((item->>'price')::numeric * (item->>'quantity')::int) AS total_revenue
      FROM orders, LATERAL jsonb_array_elements(items) AS item
    `);
    const totalRevenue = parseFloat(revenueResult.rows[0].total_revenue || 0);

    const recentOrdersResult = await client.query(`
      SELECT id, customer_name, customer_email, created_at, order_status, items
      FROM orders ORDER BY created_at DESC LIMIT 5
    `);

    const recentOrders = recentOrdersResult.rows.map((order) => {
      let total = 0;
      const items = order.items;
      if (Array.isArray(items)) {
        items.forEach((item) => {
          total += parseFloat(item.price) * item.quantity;
        });
      }
      return { ...order, total: Number(total.toFixed()) };
    });

    client.release();

    return NextResponse.json({
      totalUsers: parseInt(total_users),
      totalOrders: parseInt(total_orders),
      totalRevenue: Number(totalRevenue.toFixed()),
      recentOrders,
    });
  } catch (error) {
    console.error("Error in /dashboard-summary:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
