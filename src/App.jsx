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
import { AuthProvider } from "./store/AuthContext";
import { useAuth } from "./store/AuthContext";

import { ToastContainer } from "react-toastify";
import Profile from "./pages/Profile";

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Header />}
      <Cart />
      <Checkout />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<Orders />} />
        {/* <Route path="/profile" element={<Profile />} /> */}
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
