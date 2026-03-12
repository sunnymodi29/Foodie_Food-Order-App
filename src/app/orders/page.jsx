"use client";

import useHttp from "@/hooks/useHttp";
import { useAuth } from "@/store/AuthContext";
import { useEffect, useState } from "react";
import Input from "components/UI/Input";
import { formatDateTime } from "util/common";

const requestConfig = {};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [selectedRange, setSelectedRange] = useState("all");

  const { data: ordersData, isLoading } = useHttp(
    user ? `/api/orders/user/${user.id}` : null,
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
    return (
      order.items.some((item) =>
        [item.name, item.description]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ) && filterByDateRange(order.created_at)
    );
  });

  if (isLoading) return <p className="center">Fetching Orders...</p>;

  return (
    <div className="orders-container">
      <h2>Your Orders ({filteredOrders.length || 0})</h2>
      <Input
        type="text"
        placeholder="Search by meal name..."
        value={searchTerm}
        className="search-input"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <select
        className="date-filter"
        value={selectedRange}
        onChange={(e) => setSelectedRange(e.target.value)}
      >
        <option value="all">All Orders</option>
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
        <option value="3months">Past 3 Months</option>
      </select>
      {filteredOrders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        filteredOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <span>Order ID: #{order.id}</span>
              <small className="order-date">
                Placed on: {formatDateTime(order.created_at)}
              </small>
              <span>
                <span>Status: </span>
                <span
                  className={`status-${order.order_status?.replaceAll(" ", "").toLowerCase() || "pending"}`}
                >
                  {order.order_status}
                </span>
              </span>
            </div>
            <div className="order-address">
              <strong>Delivering Address: </strong>
              <span>
                {order.street}, {order.city} - {order.postal_code}
              </span>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item.id}>
                  <img
                    src={
                      item.image
                        ? item.image.startsWith("images/")
                          ? `https://foodie-food-order-app.onrender.com/${item.image}`
                          : item.image
                        : "/images/not-available-image.jpg"
                    }
                    alt={item.name}
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <span>
                      Quantity: {item.quantity} × ${item.price} = $
                      {(item.quantity * parseFloat(item.price)).toFixed()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
