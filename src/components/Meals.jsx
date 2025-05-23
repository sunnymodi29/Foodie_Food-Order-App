import { useState, useEffect } from "react";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
import MealItem from "./MealItem";
import Toastify from "./Toastify";

const requestConfig = {};

const Meals = () => {
  // const [searchTerm, setSearchTerm] = useState("");

  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp(
    "https://foodie-food-order-app.onrender.com/meals",
    requestConfig,
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        Toastify({
          toastType: "info",
          message: "Still fetching meals... Please wait a moment.",
        });
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // const filteredMeals = loadedMeals.filter((meal) =>
  //   meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (isLoading) {
    return <p className="center">Fetching Meals...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  return (
    <>
      {/* <input
        type="text"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      /> */}
      <ul id="meals">
        {/* {filteredMeals.length > 0 ? (
          filteredMeals.map((meal) => <MealItem key={meal.id} meal={meal} />)
        ) : (
          <p className="center">No meals found</p>
        )} */}
        {loadedMeals.map(
          (meal) => meal.inStock && <MealItem key={meal.id} meal={meal} />
        )}
      </ul>
    </>
  );
};

export default Meals;
