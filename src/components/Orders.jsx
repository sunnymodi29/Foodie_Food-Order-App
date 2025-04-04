import { useNavigate } from "react-router-dom";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";
import MealItem from "./MealItem";
import { useState } from "react";
import { useAuth } from "../store/AuthContext";

const requestConfig = {};

const Orders = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useHttp(
    `https://foodie-food-order-app.onrender.com/fetch-orders/${user}`,
    requestConfig,
    []
  );

  const [ordersItems, setOrdersItems] = useState([]);
  const [cutomerData, setCutomerData] = useState([]);

  const orders_items = ordersData.items;
  const customer_data = ordersData.customer;

  console.log(ordersData);

  if (isLoading) {
    return <p className="center">Fetching Orders...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch orders" message={error} />;
  }

  return (
    <>
      <Button textOnly onClick={() => navigate("/")}>
        Home
      </Button>
      <ul id="meals">
        {ordersData?.map((meal) =>
          meal.items?.map((mealItems) => (
            <MealItem key={mealItems.id} meal={mealItems} type="orders" />
          ))
        )}

        {/* {ordersData?.map((meal) =>
          meal.items?.map((mealItems) =>
            meal.customer?.map((customerData) => (
              <MealItem
                key={mealItems.id}
                meal={mealItems}
                customerData={customerData}
                type="orders"
              />
            ))
          )
        )} */}
      </ul>
    </>
  );
};

export default Orders;
