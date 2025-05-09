import Modal from "./UI/Modal";
import { useContext, useEffect, useState } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
import { useAuth } from "../store/AuthContext";
import Addresses from "./Addresses";
import Toastify from "./Toastify";
import { ChevronLeft } from "lucide-react";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const Checkout = () => {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const { user, currencyFormatter } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp(
    "https://foodie-food-order-app.onrender.com/orders",
    requestConfig
  );

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleBackToCart() {
    setShowError(false);
    userProgressCtx.hideCheckout();
    setTimeout(() => {
      userProgressCtx.showCart();
    }, 0);
  }

  function handleClose() {
    userProgressCtx.hideCheckout();
    setSelectedAddress(null);
    setShowError(false);
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
    setShowError(false);
  }

  function handleSelectedAddresses(selectedAddr) {
    setSelectedAddress(selectedAddr);
    setShowError(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setShowError(false);

    if (selectedAddress) {
      sendRequest(
        JSON.stringify({
          items: cartCtx.items,
          customer: selectedAddress,
          user_id: user.id,
        })
      );
    } else {
      setShowError(true);
      return;
    }
  }

  let actions = (
    <>
      <Button type="button" className="secondary-button" onClick={handleClose}>
        Close
      </Button>
      <Button type="submit" onClick={handleSubmit}>
        Submit Order
      </Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.progress === "checkout"}
        onClose={handleFinish}
      >
        <h2>Success!</h2>
        <p>Your order was submitted successfully.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes.
        </p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      className="checkout"
      open={userProgressCtx.progress === "checkout"}
      onClose={handleClose}
    >
      <span className="back-button" onClick={handleBackToCart} title="Back">
        <ChevronLeft />
      </span>
      <form>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter(cartTotal)}</p>

        <Addresses
          addresses={addresses}
          setAddresses={setAddresses}
          editable="true"
          isSelectAddress="true"
          handleSelectedAddresses={handleSelectedAddresses}
          selectedAddress={selectedAddress}
        />
        {showError && (
          <p className="errorText">
            Please Select Address Or Add New Address!!
          </p>
        )}

        {/* <Input label="Full Name" id="name" type="text" />
        <Input label="E-Mail Address" id="email" type="email" />
        <Input label="Street" id="street" type="text" />
        <div className="control-row">
          <Input label="Postal Code" id="postal-code" type="text" />
          <Input label="City" id="city" type="text" />
        </div> */}

        {error && <Error title="Failed to submit order" message={error} />}

        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
};

export default Checkout;
