import { useState, useEffect } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import useHttp from "../hooks/useHttp";
// import googleImage from "../assets/googleLogo.png";
import { useAuth } from "../store/AuthContext";
import logoImg from "../assets/logo-transparent.png";
import Toastify from "../components/Toastify";

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
    email: "",
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

      let toastMessage = isLoginMode
        ? "Login Successful! 🍕"
        : "Signup Successful! 🎉";

      Toastify({
        toastType: "success",
        message: toastMessage,
      });
    } catch (error) {
      Toastify({
        toastType: "error",
        message: "Oops! Something went wrong. Please try again.",
      });
    } finally {
    }
  }

  useEffect(() => {
    if (data) {
      console.log("Data received:", data);
      login(data.userId);
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
              value={userData.email}
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
        <div className="fullscreen-overlay">
          <div className="spinner-large"></div>
          <div className="loading-message">
            {isLoginMode ? "Authenticating..." : "Creating your account..."}
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
