import { BarChart3, Users, ShoppingCart, DollarSign } from "lucide-react";
import "../Admin/adminIndex.css";
import useHttp from "../hooks/useHttp";
import { useEffect, useState } from "react";

const requestConfig = {};

export default function Dashboard() {
  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Pending");

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useHttp(
    "https://foodie-food-order-app.onrender.com/dashboard-summary",
    requestConfig,
    []
  );

  useEffect(() => {
    if (dashboardData) {
      setDashboardSummary(dashboardData);
      console.log(dashboardSummary);
    }
  }, [dashboardData]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="overview-grid">
        <AdminCard className="card">
          <AdminCardContent className="card-content">
            <div>
              <h2 className="card-title">Orders</h2>
              <p className="card-value">{dashboardSummary?.totalOrders || 0}</p>
            </div>
            <ShoppingCart size={32} />
          </AdminCardContent>
        </AdminCard>

        <AdminCard className="card">
          <AdminCardContent className="card-content">
            <div>
              <h2 className="card-title">Revenue</h2>
              <p className="card-value">${dashboardData.totalRevenue || 0}</p>
            </div>
            <DollarSign size={32} />
          </AdminCardContent>
        </AdminCard>

        <AdminCard className="card">
          <AdminCardContent className="card-content">
            <div>
              <h2 className="card-title">Users</h2>
              <p className="card-value">{dashboardData.totalUsers || 0}</p>
            </div>
            <Users size={32} />
          </AdminCardContent>
        </AdminCard>

        {/* <AdminCard className="card">
          <AdminCardContent className="card-content">
            <div>
              <h2 className="card-title">Reports</h2>
              <p className="card-value">5</p>
            </div>
            <BarChart3 size={32} />
          </AdminCardContent>
        </AdminCard> */}
      </div>

      {/* Recent Orders Table */}
      <div className="orders-table-container">
        <h2 className="table-title">Recent Orders</h2>
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
              {dashboardData?.recentOrders?.map((orders) => {
                return (
                  <tr>
                    <td>#{orders.id}</td>
                    <td>{orders.customer_name}</td>
                    <td>
                      {orders.items.map((item, index) => {
                        return (
                          <span className="ordered_mealName">
                            {item.name}
                            {index < orders.items.length - 1 && ", "}
                          </span>
                        );
                      })}
                    </td>
                    <td>${orders.total}</td>
                    <td
                      className={`status-${
                        orders.order_status
                          ?.replaceAll(" ", "")
                          .toLocaleLowerCase() || "pending"
                      }`}
                    >
                      {orders.order_status}
                    </td>
                    <td>
                      {new Date(orders.created_at).toDateString() +
                        " : " +
                        new Date(orders.created_at)
                          .toTimeString()
                          .split("GMT")[0]
                          .trim()}
                    </td>
                  </tr>
                );
              })}

              {/* <tr>
                <td>#12346</td>
                <td>John Smith</td>
                <td>$13.50</td>
                <td className="status-pending">Pending</td>
              </tr>
              <tr>
                <td>#12347</td>
                <td>Alice Lee</td>
                <td>$7.99</td>
                <td className="status-cancelled">Cancelled</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminCard({ className = "", children }) {
  return <div className={`custom-card ${className}`}>{children}</div>;
}

export function AdminCardContent({ className = "", children }) {
  return <div className={`custom-card-content ${className}`}>{children}</div>;
}
