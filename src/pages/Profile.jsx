import { useEffect, useState } from "react";
import Input from "../components/UI/Input";
import Button from "../components/UI/Button";
import { useAuth } from "../store/AuthContext";
import useHttp from "../hooks/useHttp";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Toastify from "../components/Toastify";
import getFirstCharcters from "../util/common";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  const userProfileVal = getFirstCharcters(user?.username);

  console.log(userProfileVal);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    pincode: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user?.username);
      setEmail(user?.email);
      setPassword(user?.password);
      setAddresses(user?.addresses ? user?.addresses : []);
    }
  }, [user]);

  const handleAddAddress = () => {
    if (label && street && city && pincode) {
      const newAddr = {
        ...newAddress,
        id: Date.now(),
      };
      setAddresses((prev) => [...prev, newAddr]);
      setNewAddress({ label: "", street: "", city: "", pincode: "" });
      setShowAddForm(false);
    }
  };

  const handleCancelAddress = () => {
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const toggleAccordion = () => {
    setIsAccordionOpen((prev) => !prev);
  };

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
  } = useHttp(
    "https://foodie-food-order-app.onrender.com/editprofile",
    requestConfig
  );

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
    };

    console.log(updatedProfileJSON);

    await sendRequest(JSON.stringify(updatedProfileJSON));
  };

  useEffect(() => {
    if (data && !isSending) {
      Toastify({
        toastType: "success",
        message: "Profile Saved Successfully!!",
      });
      if (data.passwordChanged) {
        const userData = localStorage.getItem("user");
        const userObj = JSON.parse(userData);
        delete userObj.id;
        localStorage.setItem("user", JSON.stringify(userObj));
        setTimeout(() => {
          navigate("/login");
        }, 0);
      }
    }
  }, [data]);

  return (
    <div className="profile-container">
      <span className="profile-wrapper">
        <span className="profile-img">{userProfileVal}</span>
      </span>
      {isSending && <Loader />}
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
        <Button
          className="add-address-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add New Address
        </Button>

        {/* {!showAddForm && <span className="border"></span>} */}

        {showAddForm && (
          <div className="add-address-form">
            <Input
              type="text"
              required
              placeholder="Label (e.g., Home, Work, Others)"
              value={newAddress.label}
              onChange={(e) =>
                setNewAddress({ ...newAddress, label: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Street"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({ ...newAddress, city: e.target.value })
              }
            />
            <Input
              type="text"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) =>
                setNewAddress({ ...newAddress, pincode: e.target.value })
              }
            />
            <Button onClick={handleAddAddress}>Save Address</Button>
            <Button textOnly onClick={handleCancelAddress}>
              Cancel
            </Button>
          </div>
        )}

        <span className="border"></span>

        <div className="accordion-header" onClick={toggleAccordion}>
          <label>Saved Addresses </label>
          <span>{isAccordionOpen ? "▲" : "▼"}</span>
        </div>

        {isAccordionOpen && (
          <div className="saved-addresses">
            {addresses.map((addr) => (
              <div key={addr.id} className="address-card">
                <strong className="address-type">{addr.label}</strong>
                <p>
                  {addr.street}, {addr.city} - {addr.pincode}
                </p>
                <div className="address-actions">
                  {/* <Button textOnly>Edit</Button> */}
                  <Button textOnly onClick={() => handleDelete(addr.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {addresses.length === 0 && <p>No Saved Addresses Yet!</p>}
          </div>
        )}

        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Profile;
