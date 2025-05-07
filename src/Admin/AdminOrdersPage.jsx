import useHttp from "../hooks/useHttp";
import { useAuth } from "../store/AuthContext";
import { useEffect, useState } from "react";
import Input from "../components/UI/Input";
import { formatDateTime } from "../util/common";

const requestConfig = {};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [selectedRange, setSelectedRange] = useState("all");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const {
    data: ordersData,
    isLoading,
    error,
  } = useHttp(
    `https://foodie-food-order-app.onrender.com/fetch-orders/${user?.id}`,
    requestConfig,
    []
  );

  useEffect(() => {
    if (ordersData?.length) {
      setOrders(ordersData);
    }
  }, [ordersData]);

  // 🕒 Function to filter by date range
  const filterByDateRange = (orderDate) => {
    const now = new Date();
    const orderTime = new Date(orderDate);

    switch (selectedRange) {
      case "week":
        return now - orderTime <= 7 * 24 * 60 * 60 * 1000; // Past 7 days
      case "month":
        return now - orderTime <= 30 * 24 * 60 * 60 * 1000; // Past 30 days
      case "3months":
        return now - orderTime <= 90 * 24 * 60 * 60 * 1000; // Past 3 months
      default:
        return true; // "all" - No filter
    }
  };

  // 🔍 Filter orders by search term and date range
  const filteredOrders = orders.filter((order) => {
    const orderIdMatch = order.id.toString().includes(searchTerm);
    const itemMatch = order.items.some((item) =>
      [item.name, item.description]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    return (orderIdMatch || itemMatch) && filterByDateRange(order.created_at);
  });

  const ordersStatusArray = [
    "Pending",
    "Preparing",
    "Out For Delivery",
    "Delivered",
    "Cancelled",
  ];

  const handleOrderStatus = async (event, orderId) => {
    const newStatus = event.target.value;

    try {
      setUpdatingOrderId(orderId);
      const response = await fetch(
        "https://foodie-food-order-app.onrender.com/update-order-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId, status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state optimistically
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status");
    } finally {
      setTimeout(() => {
        setUpdatingOrderId(null);
      }, 100);
    }
  };

  if (isLoading) {
    return <p className="center">Fetching Orders...</p>;
  }

  return (
    <div className="orders-container">
      <h1 class="admin-title">Manage Orders ({filteredOrders.length || 0})</h1>
      <Input
        type="text"
        placeholder="Search by meal name..."
        className="search-input"
        value={searchTerm}
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
                  <th>Order At</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((orders) => (
                  <tr key={orders.id}>
                    <td>#{orders.id}</td>
                    <td>{orders.customer_name}</td>
                    <td>
                      {orders.items.map((item, index) => (
                        <span className="ordered_mealName" key={index}>
                          {item.name}
                          {index < orders.items.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td>${orders.total}</td>
                    <td>
                      {updatingOrderId === orders.id ? (
                        <div className="spinner_wrap">
                          <div className="spinner-small"></div>
                        </div>
                      ) : (
                        <select
                          value={orders.order_status}
                          className="date-filter"
                          onChange={(e) => handleOrderStatus(e, orders.id)}
                        >
                          {Array.from(ordersStatusArray)?.map((status) => {
                            return (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            );
                          })}
                        </select>
                      )}
                    </td>
                    <td>{formatDateTime(orders.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
