import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toastify from "../components/Toastify";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import useHttp from "../hooks/useHttp";
import Loader from "../components/Loader";
import AskAI from "../components/UI/AskAI";
import { CircleArrowRight, X } from "lucide-react";
import { is } from "date-fns/locale";

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
  const [showAIButton, setShowAIButton] = useState(true);
  const [showAIPopup, setShowAIPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });

  const aiTextarea = useRef(null);

  const navigate = useNavigate();

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

  // Toggle AI popup visibility with Ctrl+Shift+A
  useEffect(() => {
    const handleKeydown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey; // ctrl on Win/Linux, cmd on macOS

      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setShowAIPopup((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  // Dynamically set the tooltip content based on the platform
  useEffect(() => {
    let isMac = false;

    if (navigator.userAgentData) {
      // Check if the user agent data is available (modern browsers)
      isMac = navigator.userAgentData.platform.toLowerCase().includes("mac");
    } else {
      // If not, fallback to the user agent string
      isMac = navigator.userAgent.toLowerCase().includes("mac");
    }

    const platformUsingKey = isMac ? "Cmd" : "Ctrl";

    const btn = document.querySelector(".ask-ai-wrapper button");
    if (btn) {
      btn.setAttribute("data-platform", platformUsingKey);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        if (file.size > MAX_IMAGE_SIZE) {
          e.target.value = "";
          Toastify({
            toastType: "error",
            message: "Image is too large! Please select an image under 1MB.",
          });
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({ ...prev, image: reader.result })); // base64 string
        };
        reader.readAsDataURL(file);
      }
    } else if (name === "description") {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (value) {
        setShowAIButton(false); // Hide AI button when description is filled
        setShowAIPopup(false); // Hide AI popup when description is filled
      } else {
        setShowAIButton(true); // Show AI button when description is cleared
      }

      // Reset response when description is cleared
      if (!value) {
        setResponse(""); // or setResponse('') depending on your initial response state
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

    // Send formData directly, including base64 image
    try {
      const response = await sendRequest(JSON.stringify(formData));

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

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(
        "https://foodie-food-order-app.onrender.com/ask-ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        }
      );

      const data = await res.json();

      if (data.answer && data.answer.description) {
        setShowAIPopup(false); // Hide AI popup after getting response
        setShowAIButton(false); // Hide AI button when asking a question
        setResponse(data.answer.description);
        setFormData((prev) => ({
          ...prev,
          description: data.answer.description,
        }));
      } else if (data.raw) {
        // setResponse(
        //   data.raw.replace(/\\|["'\[\]{}\n\r]|description\s*:\s*/gi, "").trim()
        // );
        Toastify({
          toastType: "error",
          message: "Something went wrong in server. Please try again!",
        });
      } else {
        Toastify({
          toastType: "error",
          message: "No valid description found. Please try again!",
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Toastify({
        toastType: "error",
        message: "Error getting description. Please try again!",
      });
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
            placeholder=""
            value={formData.description || (response && response)}
            onChange={handleChange}
            className="input-field position-relative"
            rows="4"
            isTextarea="true"
            askAI={showAIButton}
          />
          {showAIButton && (
            <div className="ask-ai-wrapper">
              <AskAI>
                <span>Meal Description or</span>
                <button
                  type="button"
                  onClick={() => setShowAIPopup(!showAIPopup)}
                >
                  Generate with AI...
                </button>
              </AskAI>
            </div>
          )}

          {showAIPopup && (
            <div className="popup-container">
              <div className="popup-wrapper">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient
                      id="ai_gradient"
                      x1="3.59964"
                      y1="1.94859"
                      x2="22.5376"
                      y2="6.49998"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#A34BE9"></stop>
                      <stop offset="1" stopColor="#522B5C"></stop>
                    </linearGradient>
                  </defs>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.70959 1.95936C3.99295 1.24279 5.00711 1.24279 5.29047 1.95936L5.78644 3.21359L7.04064 3.70955C7.75723 3.99292 7.75721 5.00713 7.04058 5.29046L5.78603 5.78645L5.29007 7.04064C5.00671 7.75721 3.99255 7.75721 3.70919 7.04064L3.2132 5.78638L1.9593 5.29043C1.24278 5.00702 1.24283 3.99292 1.95936 3.70957L3.21361 3.21359L3.70959 1.95936ZM4.50003 4.03924C4.41373 4.24799 4.24785 4.41383 4.03907 4.50008C4.24766 4.58638 4.41338 4.75214 4.49963 4.96076C4.58593 4.752 4.75181 4.58616 4.96059 4.49992C4.752 4.41363 4.58627 4.24786 4.50003 4.03924ZM10.1521 3.09436C10.4354 2.3778 11.4496 2.37779 11.7329 3.09436L13.733 8.15204L18.7906 10.152C19.5072 10.4354 19.5072 11.4496 18.7906 11.733L13.7317 13.733L11.7317 18.7906C11.4483 19.5072 10.4342 19.5072 10.1508 18.7906L8.15078 13.7329L3.09428 11.7329C2.37776 11.4495 2.3778 10.4354 3.09434 10.1521L8.15204 8.15204L10.1521 3.09436ZM10.9425 5.17452L9.44338 8.96551C9.35698 9.184 9.184 9.35698 8.96552 9.44338L5.17432 10.9426L8.96432 12.4416C9.18278 12.528 9.35574 12.701 9.44213 12.9195L10.9413 16.7105L12.4404 12.9195C12.5268 12.701 12.6998 12.528 12.9183 12.4416L16.7103 10.9424L12.9195 9.44338C12.701 9.35698 12.528 9.18401 12.4416 8.96551L10.9425 5.17452ZM18.239 11.5469C18.2387 11.5468 18.2383 11.5467 18.238 11.5465L18.239 11.5469ZM11.5466 3.64699L11.547 3.64596L11.5466 3.64699Z"
                    fill="#ffc404"
                  ></path>
                </svg>
                <input
                  ref={aiTextarea}
                  name="ai-question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe the meal you want to generate..."
                  rows={1}
                  cols={50}
                  className="ai-question-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!loading && question.trim()) {
                        handleAsk();
                      }
                    }
                  }}
                />
                <div className="ai-actions-button">
                  <button
                    type="button"
                    onClick={handleAsk}
                    disabled={loading || !question.trim()}
                    className="ask-ai-button"
                  >
                    <CircleArrowRight />
                  </button>
                  <button
                    type="button"
                    className="close-popup-button"
                    disabled={loading}
                  >
                    <X
                      color="#cfcfcfff"
                      onClick={() => setShowAIPopup(false)}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

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
