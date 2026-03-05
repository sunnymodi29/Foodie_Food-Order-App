import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../components/UI/Input";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const res = await fetch(`https://foodie-food-order-app.onrender.com/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password updated successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage(data.error);
      }

    } catch (err) {
      setMessage("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit} className="reset-password-form">
        <Input
          label="password"
          type="password"
          placeholder="New password"
          name="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="Confirm password"
          name="confirmPassword"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Reset Password"}
        </Button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}