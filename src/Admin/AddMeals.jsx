import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toastify from "../components/Toastify";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import useHttp from "../hooks/useHttp";
import Loader from "../components/Loader";
// import "../styles/AddMeal.css";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function AddMeals() {
  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp(
    "https://foodie-food-order-app.onrender.com/add-meal",
    requestConfig
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      Toastify({
        toastType: "error",
        message: "Please fill in all required fields!",
      });
      return;
    }

    const formMealData = new FormData(event.target);
    const mealData = Object.fromEntries(formMealData.entries());

    mealData.image = `images/${mealData.image.name}`;

    try {
      const response = await sendRequest(JSON.stringify(mealData));

      {
        response &&
          !isSending &&
          Toastify({
            toastType: "success",
            message: "Meal added successfully!",
          });

        setTimeout(() => {
          navigate("/dashboard");
        }, 10);
      }
    } catch (err) {
      Toastify({ toastType: "error", message: "Failed to add meal." });
    }
  };

  return (
    <div className="add-meal-container">
      {isSending && <Loader>Adding...</Loader>}
      <h1 className="page-title">🍽️ Add New Meal</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <Input
          label="Enter Meal Name:"
          type="text"
          name="name"
          placeholder="Meal Name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          required
        />

        <Input
          label="Enter Meal Description:"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
          rows="3"
          isTextarea="true"
        />

        <Input
          label="Enter Meal Price:"
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="input-field"
          required
        />

        <label>Select Meal Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select Category</option>
          <option value="burger">Burger</option>
          <option value="pizza">Pizza</option>
          <option value="noodles">Noodles</option>
          <option value="dessert">Dessert</option>
          <option value="drinks">Drinks</option>
        </select>

        <Input
          label="Select Meal Image:"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="file-input"
        />

        <Button type="submit" className="w-100">
          Add Meal
        </Button>
      </form>
    </div>
  );
}
