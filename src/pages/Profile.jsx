import { useEffect, useState } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../store/AuthContext";
import useHttp from "../hooks/useHttp";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Toastify from "../components/Toastify";
import getFirstCharacters from "../util/common";
import Addresses from "../components/Addresses";
import Card from "../components/UI/Card";
import CustomDropdown from "../components/CustomDropdown";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const Profile = () => {
  const { user, login, updateCurrency } = useAuth();
  const navigate = useNavigate();

  const userProfileVal = getFirstCharacters(user?.username);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [passwordChangedState, setPasswordChangedState] = useState("");
  const [currencyData, setCurrencyData] = useState();

  useEffect(() => {
    if (user) {
      setName(user?.username);
      setEmail(user?.email);
      setPassword(user?.password);
      setAddresses(user?.addresses ? user?.addresses : []);
    }
  }, [user]);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
  } = useHttp(
    "https://foodie-food-order-app.onrender.com/editprofile",
    requestConfig
  );

  useEffect(() => {
    const getCurrencyData = async () => {
      try {
        const response = await fetch(
          "https://foodie-food-order-app.onrender.com/get-currency"
        );

        if (!response.ok) {
          throw new Error("Failed to get currency data");
        }
        const cdata = await response.json();
        cdata && setCurrencyData(cdata);
      } catch (err) {
        console.error(err);
      }
    };

    getCurrencyData();
  }, []);

  const handleCurrencyChange = () => {
    handleSaveChanges();
  };

  const handleSaveChanges = async () => {
    let updatedAddressArray = JSON.stringify([...addresses]);
    let user_id = user.id;

    let updatedProfileJSON = {
      user_id,
      username: name,
      email,
      password,
      new_password: newPassword,
      addresses: updatedAddressArray,
      currency_code: localStorage.getItem("currency"),
    };

    let loginJSON = {
      username: name,
      email,
      password,
    };

    const response = await sendRequest(JSON.stringify(updatedProfileJSON));
    setPasswordChangedState(response);

    if (response?.currency_code) {
      updateCurrency(response.currency_code);
    }

    await sendRequest(
      JSON.stringify(loginJSON),
      "https://foodie-food-order-app.onrender.com/login"
    );
  };

  let loginViaProfile = false;

  useEffect(() => {
    if (data && !isSending) {
      Toastify({
        toastType: "success",
        message: "Profile Saved Successfully!!",
      });
      if (passwordChangedState.passwordChanged) {
        const userData = localStorage.getItem("user");
        const userObj = JSON.parse(userData);
        delete userObj.id;
        localStorage.setItem("user", JSON.stringify(userObj));
        setTimeout(() => {
          navigate("/login");
        }, 0);
      }
    }
    if (data?.user) {
      loginViaProfile = true;
      login(data.user, loginViaProfile);
    }
    setNewPassword("");
  }, [data, isSending]);

  return (
    <Card>
      <div className="currency_wrapper">
        <CustomDropdown
          currencyData={currencyData}
          handleCurrencyChange={handleCurrencyChange}
        />
      </div>
      <span className="profile-wrapper">
        <span className="profile-img">{userProfileVal}</span>
      </span>
      {isSending && <Loader>Saving...</Loader>}
      <div></div>
      <h2>Edit Profile</h2>

      <div className="profile-form">
        <Input
          label="Name:"
          type="text"
          value={name}
          id="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email:"
          type="email"
          value={email}
          id="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="New Password:"
          type="password"
          // value={password}
          placeholder="Enter new password"
          id="newPassword"
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="address-section">
        <Addresses
          addresses={addresses}
          setAddresses={setAddresses}
          editable="true"
        />

        <Button className="w-100" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
};

export default Profile;
