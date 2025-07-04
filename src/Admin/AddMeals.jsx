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

  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

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
    } else if (name === "description") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Reset response when description is cleared
      if (!value) {
        setResponse(null); // or setResponse('') depending on your initial response state
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
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
          navigate("/admin/menu");
        }, 10);
      }
    } catch (err) {
      Toastify({ toastType: "error", message: "Failed to add meal." });
    }
  };

  // const handleAsk = async () => {
  //   if (!question.trim()) return;
  //   setLoading(true);
  //   setResponse("");

  //   try {
  //     const res = await fetch("http://localhost:3000/ask-ai", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ question }),
  //     });

  //     const data = await res.json();
  //     console.log(data);
  //     const parsed = JSON.parse(data.answer);
  //     setResponse(parsed || "No response.");
  //     // setResponse(data.answer || "No response.");
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //     // setResponse("Error fetching response.");
  //   }

  //   setLoading(false);
  // };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:3000/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (data.answer && data.answer.description) {
        setResponse(data.answer.description);
      } else if (data.raw) {
        // setResponse(
        //   data.raw.replace(/\\|["'\[\]{}\n\r]|description\s*:\s*/gi, "").trim()
        // );
        setResponse("Something went wrong in sever. Please try again!");
      } else {
        setResponse("No valid description found.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResponse("Error getting description.");
    }

    setLoading(false);
  };

  return (
    <div className="add-meal-container">
      {isSending && <Loader>Adding...</Loader>}
      <h1 className="admin-title">Add New Meal</h1>
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

        <div className="description-wrapper">
          <Input
            label="Enter Meal Description:"
            name="description"
            placeholder="Description"
            value={formData.description || (response && response)}
            onChange={handleChange}
            className="input-field position-relative"
            rows="3"
            isTextarea="true"
            askAI="false"
          />

          {/* <div className="ask-ai-wrapper">Ask AI</div> */}
        </div>

        {/* <div className="App">
          <label>Ask AI</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question..."
            rows={4}
            cols={50}
          />
          <br />
          <button type="button" onClick={handleAsk} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
          {response && (
            <div className="response">
              <strong>AI:</strong> <p>{response}</p>
            </div>
          )}
        </div> */}

        {/* <iframe src="https://chat.openai.com" frameborder="0"></iframe> */}

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
