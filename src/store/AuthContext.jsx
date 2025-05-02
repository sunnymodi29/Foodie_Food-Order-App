import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // navigate("/");
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, []);

  const login = (userData, loginViaProfile, isAdmin) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (!loginViaProfile) {
      if (isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
    setLoading(false);
    // !loginViaProfile && navigate("/");
  };

  const logout = () => {
    sessionStorage.setItem("manualLogout", "true");
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("manualLogout");
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
