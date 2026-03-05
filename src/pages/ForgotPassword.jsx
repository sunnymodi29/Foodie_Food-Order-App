import { useState } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://foodie-food-order-app.onrender.com/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();
      setMessage(data.message || "Reset link sent successfully!");
    } catch (err) {
      setMessage("Something went wrong! Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
