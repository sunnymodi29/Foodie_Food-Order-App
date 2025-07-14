import { BarChart3, Users, ShoppingCart, DollarSign } from "lucide-react";
import "../Admin/adminIndex.css";
import useHttp from "../hooks/useHttp";
import { useEffect, useState } from "react";
import SkeletonText from "../components/UI/SkeletonText";
import { formatDateTime } from "../util/common";
import { useAuth } from "../store/AuthContext";

const requestConfig = {};

export default function Dashboard() {
  const { currencyFormatter } = useAuth();

  const [dashboardSummary, setDashboardSummary] = useState(null);

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
    }
  }, [dashboardData]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>

      {/* Overview Cards */}
      <div className="overview-grid">
        <AdminCard className="card">
          <AdminCardContent className="card-content">
            <div>
              <p className="card-value">
                {isLoading || !dashboardSummary ? (
                  <SkeletonText />
                ) : (
                  dashboardSummary.totalUsers
                )}
              </p>
              <h2 className="card-title">Users</h2>
            </div>
            <Users size={32} />
          </AdminCardContent>
        </AdminCard>

        <AdminCard className="card">
          <AdminCardContent className="card-content">
            <div>
              <p className="card-value">
                {isLoading || !dashboardSummary ? (
                  <SkeletonText />
                ) : (
                  dashboardSummary.totalOrders
                )}
              </p>
              <h2 className="card-title">Orders</h2>
            </div>
            <ShoppingCart size={32} />
          </AdminCardContent>
        </AdminCard>

        <AdminCard className="card">
          <AdminCardContent className="card-content">
            <div>
              <p className="card-value">
                {isLoading || !dashboardSummary ? (
                  <SkeletonText />
                ) : (
                  currencyFormatter(
                    parseFloat(dashboardSummary.totalRevenue || 0)
                  )
                )}
              </p>
              <h2 className="card-title">Revenue</h2>
            </div>
            <DollarSign size={32} />
          </AdminCardContent>
        </AdminCard>
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
              {isLoading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx}>
                      <td>
                        <SkeletonText />
                      </td>
                      <td>
                        <SkeletonText />
                      </td>
                      <td>
                        <SkeletonText />
                      </td>
                      <td>
                        <SkeletonText />
                      </td>
                      <td>
                        <SkeletonText />
                      </td>
                      <td>
                        <SkeletonText />
                      </td>
                    </tr>
                  ))
                : dashboardData?.recentOrders?.map((orders) => (
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
                      <td>
                        {currencyFormatter(parseFloat(orders.total || 0))}
                      </td>
                      <td
                        className={`status-${
                          orders.order_status
                            ?.replaceAll(" ", "")
                            .toLocaleLowerCase() || "pending"
                        }`}
                      >
                        {orders.order_status}
                      </td>
                      <td>{formatDateTime(orders.created_at)}</td>
                    </tr>
                  ))}
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
