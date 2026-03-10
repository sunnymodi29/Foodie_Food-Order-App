import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  const { orderId, status } = await request.json();
  try {
    await pool.query("UPDATE orders SET order_status = $1 WHERE id = $2", [status, orderId]);
    return NextResponse.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
