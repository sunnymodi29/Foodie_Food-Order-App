import { useState } from "react";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { useAuth } from "../store/AuthContext";

const Addresses = ({
  addresses,
  setAddresses,
  editable = false,
  isSelectAddress = false,
  handleSelectedAddresses,
  selectedAddress,
}) => {
  const { user } = useAuth();

  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    postal_code: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const { label, street, city, postal_code } = newAddress;

  const handleAddAddress = () => {
    if (label && street && city && postal_code) {
      const newAddr = {
        ...newAddress,
        id: Date.now(),
        name: user?.username,
        email: user?.email,
      };
      setAddresses((prev) => [...prev, newAddr]);
      setNewAddress({ label: "", street: "", city: "", postal_code: "" });
      setShowAddForm(false);
    }
  };

  const handleCancelAddress = () => {
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  return (
    <div className="address-section">
      {editable && !isSelectAddress && (
        <Button
          type="button"
          className="add-address-btn w-100"
          onClick={() => setShowAddForm(true)}
        >
          Add New Address
        </Button>
      )}

      {showAddForm && (
        <div className="add-address-form">
          <form className="formWrapper">
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
              value={newAddress.postal_code}
              onChange={(e) =>
                setNewAddress({ ...newAddress, postal_code: e.target.value })
              }
            />
          </form>
          <Button type="submit" className="w-100" onClick={handleAddAddress}>
            Save Address
          </Button>
          <Button textOnly onClick={handleCancelAddress}>
            Cancel
          </Button>
        </div>
      )}

      <span className="border"></span>

      <div
        className="accordion-header"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
      >
        <label>Saved Addresses </label>
        <span>{isAccordionOpen ? "▲" : "▼"}</span>
      </div>

      {isAccordionOpen && (
        <div className="saved-addresses">
          {addresses?.length > 0 ? (
            addresses?.map((addr) => (
              <div
                key={addr.id}
                className={`address-card${
                  isSelectAddress ? " select-address" : ""
                } ${selectedAddress?.id === addr.id ? " selected" : ""}`}
                onClick={
                  isSelectAddress
                    ? () => handleSelectedAddresses(addr)
                    : undefined
                }
              >
                <strong className="address-type">{addr.label}</strong>
                <p>
                  {addr.street}, {addr.city} - {addr.postal_code}
                </p>
                {editable && (
                  <div className="address-actions">
                    {/* <Button textOnly>Edit</Button> */}
                    <Button
                      type="button"
                      textOnly
                      onClick={() => handleDelete(addr.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No Saved Addresses Yet!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Addresses;
