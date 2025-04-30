import { useState, useEffect } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import useHttp from "../hooks/useHttp";
import { useAuth } from "../store/AuthContext";
import logoImg from "../assets/logo-transparent.png";
import Toastify from "../components/Toastify";
import Loader from "../components/Loader";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

function Login() {
  const { login } = useAuth();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const intialUserData = {
    username: "",
    email: JSON.parse(localStorage.getItem("user"))?.email || "",
    password: "",
  };
  const [userData, setUserData] = useState(intialUserData);

  function toggleMode() {
    setIsLoginMode((prevMode) => !prevMode);
    setUserData(intialUserData);
  }

  const loginUrl = "https://foodie-food-order-app.onrender.com/login";
  const signupUrl = "https://foodie-food-order-app.onrender.com/signup";

  const url = isLoginMode ? loginUrl : signupUrl;

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp(url, requestConfig);

  async function handleUserLogin() {
    try {
      await sendRequest(JSON.stringify({ ...userData }));
      
    } catch (error) {
      Toastify({
        toastType: "error",
        message:
          error.message.includes("401") || error.message.includes("Invalid")
            ? "Invalid Credentials!!"
            : error.message || "Something went wrong!",
      });
    } finally {
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
            <img src={logoImg} alt="Foodie Logo" className="logo" />
            <h2>{isLoginMode ? "Welcome Back!" : "Join Foodie Today"}</h2>
            <p>
              {isLoginMode
                ? "Login to continue"
                : "Sign up to order your favorite meals"}
            </p>
          </div>

          <form
            className="food-login-form"
            onSubmit={(e) => e.preventDefault()}
          >
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
              type="email"
              placeholder="Email"
              required
              value={
                JSON.parse(localStorage.getItem("user"))?.email ||
                userData.email
              }
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
            />
            <Input
              type="password"
              placeholder="Password"
              required
              value={userData.password}
              onChange={(e) =>
                setUserData((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
            />

            <Button type="save" onClick={handleUserLogin} disabled={isSending}>
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

export default Login;
