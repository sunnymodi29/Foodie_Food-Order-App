import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD"
  );
  const [loading, setLoading] = useState(true);
  const [exchangeRate, setExchangeRate] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchExchangeRate(currency);
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [currency]);

  const fetchExchangeRate = async (currency) => {
    try {
      const cachedRate = localStorage.getItem(`exchangeRate_${currency}`);
      if (cachedRate) {
        setExchangeRate(parseFloat(cachedRate));
        return;
      }

      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );
      const data = await response.json();

      if (data.rates[currency]) {
        setExchangeRate(data.rates[currency]);
        localStorage.setItem(`exchangeRate_${currency}`, data.rates[currency]);

        return localStorage.getItem(`exchangeRate_${currency}`);
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
    }
  };

  const login = (userData, loginViaProfile, isAdmin) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (!loginViaProfile) {
      if (isAdmin) navigate("/admin/dashboard");
      else navigate("/");
      updateCurrency(userData.currency_code);
    }
    setLoading(false);
  };

  const logout = () => {
    sessionStorage.setItem("manualLogout", "true");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("currency");
    sessionStorage.removeItem("manualLogout");
    navigate("/login", { replace: true });
  };

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency || "USD"); // Provide a default currency if newCurrency is null
    localStorage.setItem("currency", newCurrency || "USD");
    fetchExchangeRate(newCurrency || "USD");
  };

  const currencyFormatter = (amount) => {
    // Ensure amount is a valid number
    if (isNaN(amount) || amount === null || amount === undefined) {
      amount = 0;
    }

    const convertedAmount = amount * exchangeRate;

    try {
      // Format with currency symbol
      let formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD", // Ensure we always have a valid currency code
        maximumFractionDigits: 2,
      }).format(convertedAmount.toFixed());

      // If the value is over 10,000, convert to K format
      if (convertedAmount >= 10000) {
        // Get the currency symbol
        const currencySymbol = formatted.replace(/[\d,.\s]/g, "");

        // Convert to K format (divide by 1000 and add K)
        const valueInK = (convertedAmount / 1000).toFixed(1);

        // Remove trailing zero after decimal if it exists
        const formattedK = valueInK.endsWith(".0")
          ? valueInK.slice(0, -2)
          : valueInK;

        return `${currencySymbol}${formattedK}K`;
      }

      return formatted;
    } catch (error) {
      console.error(
        "Currency formatting error:",
        error,
        "Using currency:",
        currency
      );
      // Fallback to USD if there's an error
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(convertedAmount);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        currency,
        updateCurrency,
        currencyFormatter,
        exchangeRate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
