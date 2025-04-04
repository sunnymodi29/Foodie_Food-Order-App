import { useContext } from "react";
import { currencyFormatter } from "../util/formatting";
import Button from "./UI/Button";
import CartContext from "../store/CartContext";
import Toastify from "./Toastify";

const MealItem = ({ meal, customerData, type }) => {
  const cartCtx = useContext(CartContext);

  function handleAddMealToCart() {
    cartCtx.addItem(meal);
    console.log(meal);

    Toastify({
      toastType: "success",
      message: `${meal.name} Added Successfully!`,
    });
  }

  return (
    <li className="meal-item">
      <article>
        <img
          src={`https://foodie-food-order-app.onrender.com/${meal.image}`}
          alt={meal.name}
        />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">
            {currencyFormatter.format(meal.price)}
          </p>
          <p className="meal-item-description">{meal.description}</p>
        </div>
        {type !== "orders" && (
          <p className="meal-item-actions">
            <Button onClick={handleAddMealToCart}>Add to Cart</Button>
          </p>
        )}
        {/* {console.log(customerData)} */}
        <div>
          <p></p>
        </div>
      </article>
    </li>
  );
};

export default MealItem;
