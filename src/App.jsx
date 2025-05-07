import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Header from "./components/Header";
import { CartContextProvider } from "./store/CartContext";
import { UserProgressContextProvider } from "./store/UserProgressContext";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Dashboard from "./Admin/Dashboard";
import { AuthProvider } from "./store/AuthContext";
import { useAuth } from "./store/AuthContext";

import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTopButton from "./components/UI/ScrollToTopButton";
import AddMeals from "./Admin/AddMeals";
import AdminLayout from "./Admin/components/AdminLayout/AdminLayout";
import AdminOrdersPage from "./Admin/AdminOrdersPage";
import Menu from "./Admin/components/Menu";
import { useEffect } from "react";
// import CheckoutPage from "./pages/CheckoutPage";

function AppContent() {
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    user?.admin && location.pathname === "/" && navigate("/admin/dashboard");
  }, [user?.admin]);

  return (
    <>
      <ScrollToTopButton />
      {user && <Header />}
      <Cart />
      <Checkout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {user?.admin ? (
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminOrdersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        ) : (
          <Route path="/orders" element={<Orders />} />
        )}

        {user?.admin ? (
          <Route
            path="/profile"
            element={
              <AdminLayout>
                <Profile />
              </AdminLayout>
            }
          />
        ) : (
          <Route path="/profile" element={<Profile />} />
        )}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/addmeals"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddMeals />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Menu />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <UserProgressContextProvider>
        <CartContextProvider>
          <Router>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
        </CartContextProvider>
      </UserProgressContextProvider>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
