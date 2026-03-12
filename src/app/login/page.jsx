"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "components/UI/Input";
import Button from "components/UI/Button";
import useHttp from "@/hooks/useHttp";
import { useAuth } from "@/store/AuthContext";
import Toastify from "components/Toastify";
import Loader from "components/Loader";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { email } = JSON.parse(storedUser);
      setUserData((prev) => ({ ...prev, email }));
    }
  }, []);

  function toggleMode() {
    setIsLoginMode((prevMode) => !prevMode);
    setUserData({ username: "", email: userData.email, password: "" });
  }

  const url = isLoginMode ? "/api/login" : "/api/signup";

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
  } = useHttp(url, requestConfig);

  async function handleUserLogin(e) {
    e.preventDefault();
    try {
      await sendRequest(JSON.stringify({ ...userData }));
    } catch (error) {
      Toastify({
        toastType: "error",
        message: error.message || "Something went wrong!",
      });
    }
  }

  useEffect(() => {
    if (data) {
      let toastMessage = isLoginMode
        ? "Login Successful! 🍕"
        : "Signup Successful! 🎉";

      Toastify({
        toastType: "success",
        message: toastMessage,
      });
      login(data.user, false, data.user.admin);
    }
  }, [data]);

  return (
    <>
      <div className="food-login-container">
        <div className="food-login-card">
          <div className="food-login-header">
            <img
              src="/images/app-logos/logo-transparent.png"
              alt="Foodie Logo"
              className="logo"
            />
            <h2>{isLoginMode ? "Welcome Back!" : "Join Foodie Today"}</h2>
            <p>
              {isLoginMode
                ? "Login to continue"
                : "Sign up to order your favorite meals"}
            </p>
          </div>

          <form className="food-login-form" onSubmit={handleUserLogin}>
            {!isLoginMode && (
              <Input
                type="text"
                placeholder="Full Name"
                required
                value={userData.username}
                onChange={(e) =>
                  setUserData((prevState) => ({
                    ...prevState,
                    username: e.target.value,
                  }))
                }
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="Email"
              name="email"
              required
              value={userData.email}
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
            />
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              required
              value={userData.password}
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
            />

            <p className="control">
              <span
                className="forgot-password"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </span>
            </p>

            <Button type="submit" disabled={isSending}>
              {isSending ? "Please wait..." : isLoginMode ? "Login" : "Sign Up"}
            </Button>

            <div className="food-toggle">
              <span onClick={toggleMode}>
                {isLoginMode
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </span>
            </div>
          </form>
        </div>
      </div>

      {isSending && (
        <Loader>
          {isLoginMode ? "Authenticating..." : "Creating your account..."}
        </Loader>
      )}
    </>
  );
}
