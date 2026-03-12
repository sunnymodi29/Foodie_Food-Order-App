"use client";

import useHttp from "@/hooks/useHttp";
import { useAuth } from "@/store/AuthContext";
import { useEffect, useState } from "react";
import Input from "components/UI/Input";
import { formatDateTime } from "util/common";

const requestConfig = {};

export default function AdminOrdersPage() {
  const { currencyFormatter, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRange, setSelectedRange] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const { data: ordersData, isLoading } = useHttp(
    user ? `/api/orders/${user.id}` : null,
    requestConfig,
    [],
  );

  useEffect(() => {
    if (ordersData?.length) setOrders(ordersData);
  }, [ordersData]);

  const filterByDateRange = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);
    switch (selectedRange) {
      case "week":
        return now - orderTime <= 7 * 24 * 60 * 60 * 1000;
      case "month":
        return now - orderTime <= 30 * 24 * 60 * 60 * 1000;
      case "3months":
        return now - orderTime <= 90 * 24 * 60 * 60 * 1000;
      default:
        return true;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const orderIdMatch = order.id.toString().includes(searchTerm);
    const itemMatch = order.items.some((item) =>
      [item.name, item.description]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    return (orderIdMatch || itemMatch) && filterByDateRange(order.created_at);
  });

  const handleOrderStatus = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      setUpdatingOrderId(orderId);
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, order_status: newStatus } : o,
        ),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) return <p className="center">Fetching Orders...</p>;

  return (
    <div className="orders-container">
      <h1 className="admin-title">
        Manage Orders ({filteredOrders.length || 0})
      </h1>
      <Input
        type="text"
        placeholder="Search Orders..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        value={selectedRange}
        onChange={(e) => setSelectedRange(e.target.value)}
        className="date-filter"
      >
        <option value="all">All Orders</option>
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
        <option value="3months">Past 3 Months</option>
      </select>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-table-container">
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ordered On</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <span className="ordered_mealName" key={index}>
                          {item.name}
                          {index < order.items.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td>{currencyFormatter(order.total)}</td>
                    <td>
                      {updatingOrderId === order.id ? (
                        <div className="spinner_wrap">
                          <div className="spinner-small"></div>
                        </div>
                      ) : (
                        <select
                          className="date-filter"
                          value={order.order_status}
                          onChange={(e) => handleOrderStatus(e, order.id)}
                        >
                          {[
                            "Pending",
                            "Preparing",
                            "Out For Delivery",
                            "Delivered",
                            "Cancelled",
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>{formatDateTime(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
