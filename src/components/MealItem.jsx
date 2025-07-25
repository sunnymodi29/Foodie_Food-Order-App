import { useContext } from "react";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";
import Toastify from "./Toastify";
import { useAuth } from "../store/AuthContext";

const MealItem = ({ meal, customerData, type }) => {
  const cartCtx = useContext(CartContext);
  const { currencyFormatter } = useAuth();

  function handleAddMealToCart() {
    cartCtx.addItem(meal);

    Toastify({
      toastType: "success",
      message: `${meal.name} Added Successfully!`,
    });
  }

  return (
    <li className="meal-item">
      <article>
        <img
          src={
            meal.image.startsWith("images/")
              ? `https://foodie-food-order-app.onrender.com/${meal.image}`
              : meal.image
          }
          alt={meal.name}
        />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">{currencyFormatter(meal.price)}</p>
          <p className="meal-item-description">{meal.description}</p>
        </div>
        {type !== "orders" && (
          <p className="meal-item-actions">
            <Button onClick={handleAddMealToCart}>Add to Cart</Button>
          </p>
        )}
        <div>
          <p></p>
        </div>
      </article>
    </li>
  );
};

export default MealItem;
