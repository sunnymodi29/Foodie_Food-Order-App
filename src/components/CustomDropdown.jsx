import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const CustomDropdown = ({ currencyData, handleCurrencyChange }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Load selected currency from localStorage on component mount
  useEffect(() => {
    const storedCurrency =
      localStorage.getItem("currency") ||
      JSON.parse(localStorage.getItem("user")).currency_code;
    if (storedCurrency) {
      const currency = currencyData?.find(
        (curr) => curr.currency_code === storedCurrency
      );
      if (currency) setSelectedCurrency(currency);
    }
  }, [currencyData]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (currency) => {
    setSelectedCurrency(currency);
    setShowDropdown(false);
    localStorage.setItem("currency", currency.currency_code); // Save selected currency directly
    handleCurrencyChange(currency);
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div
        className="dropdown-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {selectedCurrency ? (
          <div className="dropdown-selected">
            <img
              src={`https://flagcdn.com/${selectedCurrency?.country_code?.toLowerCase()}.svg`}
              alt={selectedCurrency.currency_name}
              className="flag-icon"
            />
            <span>{selectedCurrency.currency_code}</span>
          </div>
        ) : (
          <span>Currency</span>
        )}
        <span className="dropdown-arrow">
          {showDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}{" "}
        </span>
      </div>

      {showDropdown && (
        <ul className="dropdown-list">
          {currencyData?.map((currency) => (
            <li
              key={currency.currency_code}
              className="custom-dropdown-item"
              onClick={() => handleSelect(currency)}
              //   onClick={() => handleCurrencyChange(currency)}
            >
              <img
                src={`https://flagcdn.com/${currency.country_code?.toLowerCase()}.svg`}
                alt={currency.currency_name}
                className="flag-icon"
              />
              <span>{currency.currency_code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
