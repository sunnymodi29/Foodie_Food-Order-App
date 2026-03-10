import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/store/AuthContext";
import Toastify from "./Toastify";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!loading) {
      if (!user || !user.admin) {
        if (!hasShownToast.current) {
          const wasManualLogout =
            sessionStorage.getItem("manualLogout") === "true";
          hasShownToast.current = true;

          if (!wasManualLogout && user !== null) {
            Toastify({
              toastType: "error",
              message: "You’re not authorized to access this page!!",
            });
          }

          if (wasManualLogout) {
            sessionStorage.removeItem("manualLogout");
          }

          if (user !== null && !user?.admin) {
            router.replace("/");
          } else if (!user) {
            router.replace("/login");
          }
        }
      } else {
        setChecking(false);
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || checking) return null;

  return children;
};

export default ProtectedRoute;

