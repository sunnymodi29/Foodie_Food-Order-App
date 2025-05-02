import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import Toastify from "./Toastify";

const ProtectedRoute = ({ children }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !user.admin) {
        if (!hasShownToast.current) {
          const wasManualLogout =
            sessionStorage.getItem("manualLogout") === "true";
          hasShownToast.current = true;

          // Don't show the toast if it was a manual logout by an admin
          if (!wasManualLogout && user !== null) {
            Toastify({
              toastType: "error",
              message: "You’re not authorized to access this page!!",
            });
          }

          // Clear sessionStorage for manual logout
          if (wasManualLogout) {
            sessionStorage.removeItem("manualLogout");
          }

          if (user !== null && !user?.admin) {
            const from = location.state?.from?.pathname || "/"; // Redirect to login for non-admins
            navigate(from, { replace: true });
          }
        }
      } else {
        setChecking(false);
      }
    }
  }, [user, loading, navigate, location.state?.from?.pathname]);

  if (loading || checking) return null;

  return children;
};

export default ProtectedRoute;
