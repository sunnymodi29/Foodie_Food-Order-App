import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Header from "./components/Header";
import Meals from "./components/Meals";
import { CartContextProvider } from "./store/CartContext";
import { UserProgressContextProvider } from "./store/UserProgressContext";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Dashboard from "./Admin/Dashboard";
// import DashboardV2 from "./Admin/DashboardV2";
import { AuthProvider } from "./store/AuthContext";
import { useAuth } from "./store/AuthContext";

import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTopButton from "./components/UI/ScrollToTopButton";
// import CheckoutPage from "./pages/CheckoutPage";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      <ScrollToTopButton />
      {user && <Header />}
      <Cart />
      <Checkout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
              {/* <DashboardV2 /> */}
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
