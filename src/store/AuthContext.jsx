"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "util/common";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    const storedUser = localStorage.getItem("user");
    const storedRate = localStorage.getItem("exchangeRate");
    const storedCurrency = localStorage.getItem("currency");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRate) setExchangeRate(parseFloat(storedRate));
    if (storedCurrency) setCurrency(storedCurrency);

    setLoading(false);
  }, []);

  const fetchExchangeRate = async (targetCurrency) => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/USD`,
      );
      const data = await response.json();
      if (data.rates[targetCurrency]) {
        setExchangeRate(data.rates[targetCurrency]);
        localStorage.setItem(
          "exchangeRate",
          data.rates[targetCurrency].toString(),
        );
      }
    } catch (error) {
      console.error("Failed to fetch exchange rate:", error);
    }
  };

  const login = (userData, loginViaProfile, isAdmin) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (!loginViaProfile) {
      if (isAdmin) router.push("/admin/dashboard");
      else router.push("/");

      const userCurrency = userData.currency_code || "USD";
      setCurrency(userCurrency);
      localStorage.setItem("currency", userCurrency);
      fetchExchangeRate(userCurrency);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("currency");
    localStorage.removeItem("exchangeRate");
    router.replace("/login");
  };

  const updateCurrency = (newCurrency) => {
    const nextCurrency = newCurrency || "USD";
    setCurrency(nextCurrency);
    localStorage.setItem("currency", nextCurrency);
    fetchExchangeRate(nextCurrency);
  };

  const currencyFormatter = (amount) => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      amount = 0;
    }

    const convertedAmount = amount * exchangeRate;

    try {
      let formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: 0,
      }).format(convertedAmount);

      if (convertedAmount >= 10000) {
        const currencySymbol = formatted.replace(/[\d,.\s]/g, "");
        const valueInK = (convertedAmount / 1000).toFixed(1);
        const formattedK = valueInK.endsWith(".0")
          ? valueInK.slice(0, -2)
          : valueInK;
        return `${currencySymbol}${formattedK}K`;
      }

      return formatted;
    } catch (error) {
      console.error("Currency formatting error:", error);
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
}

export const useAuth = () => useContext(AuthContext);
