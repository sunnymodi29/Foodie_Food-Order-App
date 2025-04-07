import { useNavigate } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import { useAuth } from "../store/AuthContext";
import { useEffect, useState } from "react";
import Input from "../components/UI/Input";
import { format } from "date-fns";
import Error from "../components/Error";

const requestConfig = {};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const [selectedRange, setSelectedRange] = useState("all");

  const {
    data: ordersData,
    isLoading,
    error,
  } = useHttp(
    `https://foodie-food-order-app.onrender.com/fetch-orders/${user.id}`,
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
    return (
      order.items.some((item) =>
        [item.name, item.description]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) && filterByDateRange(order.created_at)
    );
  });

  if (isLoading) {
    return <p className="center">Fetching Orders...</p>;
  }

  // if (error) {
  //   return <Error title="Failed to fetch orders" message={error} />;
  // }

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
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
      {console.log(filteredOrders)}
      {filteredOrders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        filteredOrders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <span>Order ID: #{order.id}</span>
              <small className="order-date">
                Placed on:{" "}
                {format(new Date(order.created_at), "dd MMM yyyy, hh:mm a")}
              </small>
              {/* <span className="status">Status: Delivered</span> */}
            </div>
            <div className="order-address">
              <strong>Delievering Address: </strong>
              <span>
                {order.street}, {order.city} - {order.postal_code}
              </span>
            </div>
            <div className="order-items">
              {order.items.map((item) => (
                <div className="order-item" key={item.id}>
                  <img
                    src={`https://foodie-food-order-app.onrender.com/${item.image}`}
                    alt={item.name}
                  />
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <span>
                      Quantity: {item.quantity} × ${item.price} = $
                      {(item.quantity * parseFloat(item.price)).toFixed(2)}
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
};

export default Orders;
