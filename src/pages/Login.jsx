import { useState, useEffect } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import useHttp from "../hooks/useHttp";
// import googleImage from "../assets/googleLogo.png";
import { useAuth } from "../store/AuthContext";

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

  function handleUserLogin() {
    sendRequest(
      JSON.stringify({
        ...userData,
      })
    );
  }

  useEffect(() => {
    if (data) {
      console.log("Data received:", data);
      login(data.userId);
    }
  }, [data]);

  return (
    <div className="flex justify-center items-center h-screen bg-stone-700">
      <div className="w-full max-w-sm bg-white p-6 rounded-md shadow-2xl m-4">
        <div className="block mb-6 w-full text-md text-blue-500  text-right">
          <span className="hover:underline cursor-pointer" onClick={toggleMode}>
            {isLoginMode
              ? "Create an account"
              : "Already have an account? Log in"}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-center uppercase">
          {isLoginMode ? "Welcome Back!" : "Create An Account"}
        </h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mt-6">
          {!isLoginMode && (
            <Input
              type="text"
              // labelName="User Name"
              // isTextarea={false}
              placeholder="Enter Your Name"
              required
              value={userData.username}
              onChange={(e) =>
                setUserData((prevState) => {
                  return {
                    ...prevState,
                    username: e.target.value,
                  };
                })
              }
            />
          )}
          <Input
            type="email"
            // labelName="Email"
            // isTextarea={false}
            placeholder="Enter Your Email Address"
            required
            value={userData.email}
            onChange={(e) =>
              setUserData((prevState) => {
                return {
                  ...prevState,
                  email: e.target.value,
                };
              })
            }
          />
          <Input
            type="password"
            // labelName="Password"
            // isTextarea={false}
            placeholder="Enter Your Password"
            required
            value={userData.password}
            onChange={(e) =>
              setUserData((prevState) => {
                return {
                  ...prevState,
                  password: e.target.value,
                };
              })
            }
          />

          <Button
            // additionalClasses="w-full uppercase tracking-wider font-semibold"
            type="save"
            onClick={() =>
              isLoginMode ? handleUserLogin() : handleUserLogin()
            }
          >
            {isLoginMode ? "Login" : "Sign Up"}
          </Button>

          <div className="flex items-center justify-between my-6">
            <span className="w-2/3 border-b border-stone-700"></span>
            <span className="text-gray-800 mx-3 text-sm uppercase">or</span>
            <span className="w-2/3 border-b border-stone-700"></span>
          </div>

          {/* <Button
            // additionalClasses="w-full flex items-center justify-center gap-2 hover:bg-stone-900 hover:border-stone-900 font-semibold whitespace-nowrap"
            type="cancel"
            onClick={onGoogleLogin}
          >
            <img
              src={googleImage}
              alt="Google Logo"
              width={25}
              height={25}
              className="select-none"
            />
            Continue with Google
          </Button> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
