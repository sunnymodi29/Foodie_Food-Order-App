"use client";

import AdminLayoutComponent from "Admin/components/AdminLayout/AdminLayout";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "components/UI/Input";
import Button from "components/UI/Button";
import { useAuth } from "@/store/AuthContext";
import useHttp from "@/hooks/useHttp";
import Loader from "components/Loader";
import Toastify from "components/Toastify";
import getFirstCharacters from "util/common";
import Addresses from "components/Addresses";
import Card from "components/UI/Card";
import CustomDropdown from "components/CustomDropdown";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function ProfilePage() {
  const { user, login, updateCurrency } = useAuth();
  const router = useRouter();

  const userProfileVal = getFirstCharacters(user?.username);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [currencyData, setCurrencyData] = useState();

  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
      setPassword(user.password || "");
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
  } = useHttp("/api/profile/edit", requestConfig);

  useEffect(() => {
    const getCurrencyData = async () => {
      try {
        const response = await fetch("/api/currency");
        if (!response.ok) throw new Error("Failed");
        const cdata = await response.json();
        setCurrencyData(cdata);
      } catch (err) {
        console.error(err);
      }
    };
    getCurrencyData();
  }, []);

  const handleSaveChanges = async () => {
    const updatedProfile = {
      user_id: user.id,
      username: name,
      email,
      password,
      new_password: newPassword,
      addresses: JSON.stringify(addresses),
      currency_code: localStorage.getItem("currency"),
    };

    try {
      const response = await sendRequest(JSON.stringify(updatedProfile));
      if (response) {
        Toastify({ toastType: "success", message: "Profile Saved!!" });
        if (response.currency_code) updateCurrency(response.currency_code);

        // Re-login to update state
        const loginRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: newPassword || password }),
        });
        const loginData = await loginRes.json();
        if (loginData.user) login(loginData.user, true);

        if (response.passwordChanged) {
          router.push("/login");
        }
      }
    } catch (err) {
      Toastify({ toastType: "error", message: "Failed to save profile." });
    }
    setNewPassword("");
  };

  const profileContent = (
    <Card>
      <div className="currency_wrapper">
        <CustomDropdown
          currencyData={currencyData}
          handleCurrencyChange={handleSaveChanges}
        />
      </div>
      <span className="profile-wrapper">
        <span className="profile-img">{userProfileVal}</span>
      </span>
      {isSending && <Loader>Saving...</Loader>}
      <h2>Edit Profile</h2>
      <div className="profile-form">
        <Input
          label="Name:"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email:"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="New Password:"
          type="password"
          placeholder="Enter new password"
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

  return user?.admin ? (
    <AdminLayoutComponent>{profileContent}</AdminLayoutComponent>
  ) : (
    profileContent
  );
}
