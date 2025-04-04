import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Header from "./components/Header";
import Meals from "./components/Meals";
import { CartContextProvider } from "./store/CartContext";
import { UserProgressContextProvider } from "./store/UserProgressContext";
import Home from "./pages/Home";
import Orders from "./components/Orders";
import Login from "./pages/Login";
import { AuthProvider } from "./store/AuthContext";
import { useAuth } from "./store/AuthContext";

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
    </>
  );
}

export default App;
