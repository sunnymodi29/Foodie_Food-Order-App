"use client";

import { useState } from "react";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import logoImg from "@/public/images/logo-transparent.png";
import Loader from "@/components/Loader";
import Toastify from "@/components/Toastify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      Toastify({
        toastType: "success",
        message: data.message || "Reset link sent successfully!",
      });
    } catch (err) {
      Toastify({
        toastType: "error",
        message: err.message || "Something went wrong! Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="food-login-container">
        <div className="food-login-card">
          <div className="food-login-header">
            <img src={logoImg.src || logoImg} alt="Foodie Logo" className="logo" />
            <h2>Forgot Password</h2>
            <p>Enter your email to reset your password</p>
          </div>

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
        </div>
      </div>
      {loading && <Loader>Sending reset link...</Loader>}
    </>
  );
}
