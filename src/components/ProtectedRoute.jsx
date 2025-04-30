// ProtectedRoute.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.admin) {
    return navigate("/login");
  }

  return children;
};

export default ProtectedRoute;
