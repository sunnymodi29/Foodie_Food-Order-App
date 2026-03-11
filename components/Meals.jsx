"use client";

import { useState, useEffect } from "react";
import useHttp from "@/src/hooks/useHttp";
import Error from "./Error";
import MealItem from "./MealItem";
import Toastify from "./Toastify";

const requestConfig = {};

const Meals = () => {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp(
    "/api/meals",
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

  if (isLoading) {
    return <p className="center">Fetching Meals...</p>;
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  return (
    <ul id="meals">
      {loadedMeals.map(
        (meal) => meal.inStock && <MealItem key={meal.id} meal={meal} />
      )}
    </ul>
  );
};

export default Meals;
