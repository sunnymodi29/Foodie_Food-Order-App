import { useAuth } from "../store/AuthContext";

const CartItem = ({ name, quantity, price, onIncrease, onDecrease }) => {
  const { currencyFormatter } = useAuth();

  return (
    <li className="cart-item">
      <p>
        {name} = {quantity} x {currencyFormatter(price)}
      </p>
      <p className="cart-item-actions">
        <button onClick={onDecrease}>-</button>
        <span>{quantity}</span>
        <button onClick={onIncrease}>+</button>
      </p>
    </li>
  );
};

export default CartItem;
