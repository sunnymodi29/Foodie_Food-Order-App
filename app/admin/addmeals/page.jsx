"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Toastify from "@/components/Toastify";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import useHttp from "@/src/hooks/useHttp";
import Loader from "@/components/Loader";
import AskAI from "@/components/UI/AskAI";
import { CircleArrowRight, X } from "lucide-react";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function AddMealsPage() {
  const router = useRouter();
  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
  } = useHttp("/api/admin/meals", requestConfig);

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
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

  useEffect(() => {
    const handleKeydown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setShowAIPopup((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
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
          setFormData((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
      }
    } else if (name === "description") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (value) {
        setShowAIButton(false);
        setShowAIPopup(false);
      } else {
        setShowAIButton(true);
      }
      if (!value) setResponse("");
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
    try {
      await sendRequest(JSON.stringify(formData));
      Toastify({
        toastType: "success",
        message: "Meal added successfully!",
      });
      router.push("/admin/menu");
    } catch (err) {
      Toastify({ toastType: "error", message: "Failed to add meal." });
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.answer && data.answer.description) {
        setShowAIPopup(false);
        setShowAIButton(false);
        setResponse(data.answer.description);
        setFormData((prev) => ({ ...prev, description: data.answer.description }));
      } else {
        Toastify({ toastType: "error", message: "Error getting AI response." });
      }
    } catch (error) {
      Toastify({ toastType: "error", message: "AI error. Please try again." });
    } finally {
      setLoading(false);
    }
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
          required
        />
        <div className="description-wrapper">
          <Input
            label="Enter Meal Description:"
            name="description"
            value={formData.description || response}
            onChange={handleChange}
            rows="4"
            isTextarea="true"
            askAI={showAIButton}
          />
          {showAIButton && (
            <div className="ask-ai-wrapper">
              <AskAI>
                <span>Meal Description or</span>
                <button type="button" onClick={() => setShowAIPopup(!showAIPopup)}>
                  Generate with AI...
                </button>
              </AskAI>
            </div>
          )}
          {showAIPopup && (
            <div className="popup-container">
              <div className="popup-wrapper">
                <input
                  ref={aiTextarea}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe the meal..."
                  className="ai-question-input"
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAsk()}
                />
                <div className="ai-actions-button">
                  <button type="button" onClick={handleAsk} disabled={loading} className="ask-ai-button">
                    <CircleArrowRight />
                  </button>
                  <button type="button" onClick={() => setShowAIPopup(false)} className="close-popup-button">
                    <X />
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
          required
        />
        <Input
          label="Select Meal Image:"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />
        <Button type="submit" className="w-100">Add Meal</Button>
      </form>
    </div>
  );
}
