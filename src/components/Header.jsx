import logoImg from "../assets/logo.jpg";
import Button from "./UI/Button";
import { useContext } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { useNavigate } from "react-router-dom";
import Dropdown from "./DropDown";
import { useAuth } from "../store/AuthContext";
import { House, ShoppingCart, User } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const { user, logout } = useAuth();

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
  }

  const userOptions = [
    { label: "Profile", to: "/profile" },
    { label: "Orders", to: "/orders" },
    { label: "Logout", onClick: () => logout() },
  ];

  const adminUserOptions = [
    { label: "Profile", to: "/profile" },
    { label: "Logout", onClick: () => logout() },
  ];

  return (
    <header id={user?.admin ? "admin-main-header" : "main-header"}>
      {!user?.admin && (
        <div id="title">
          <img src={logoImg} alt="Foodie Logo" />
          <h1>Foodie</h1>
        </div>
      )}
      <nav>
        {!user?.admin &&
          location.pathname !== "/" &&
          location.pathname !== "/admin/dashboard" && (
            <Button
              textOnly
              onClick={() =>
                user?.admin ? navigate("/admin/dashboard") : navigate("/")
              }
            >
              <House size={30} />
            </Button>
          )}

        {!user?.admin && (
          <Button textOnly onClick={handleShowCart}>
            <span className="outerWrapper">
              <ShoppingCart size={30} />
              <span className="number">{totalCartItems}</span>
            </span>
          </Button>
        )}

        <Dropdown
          options={user?.admin ? adminUserOptions : userOptions}
          trigger={({ onClick }) => (
            <Button textOnly onClick={onClick}>
              <User size={30} />
            </Button>
          )}
        />
      </nav>
    </header>
  );
};

export default Header;
