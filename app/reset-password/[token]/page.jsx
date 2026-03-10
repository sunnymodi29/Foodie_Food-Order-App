"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/UI/Input";
import Button from "@/components/UI/Button";
import logoImg from "@/assets/logo-transparent.png";
import Toastify from "@/components/Toastify";
import Loader from "@/components/Loader";

export default function ResetPasswordPage({ params }) {
  const { token } = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      Toastify({ toastType: "error", message: "Passwords do not match" });
      return setLoading(false);
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (res.ok) {
        Toastify({ toastType: "success", message: "Password updated! Redirecting..." });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        Toastify({ toastType: "error", message: data.error });
      }
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
    <div className="food-login-container">
      <div className="food-login-card">
        <div className="food-login-header">
          <img src={logoImg.src || logoImg} alt="Foodie Logo" className="logo" />
          <h2>Reset Password</h2>
          <p>Enter your new password</p>
        </div>
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
      </div>
      {loading && <Loader>Resetting password...</Loader>}
    </div>
  );
}
