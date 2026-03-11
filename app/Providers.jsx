"use client";

import { AuthProvider } from "@/src/store/AuthContext";
import { CartContextProvider } from "@/src/store/CartContext";
import { UserProgressContextProvider } from "@/src/store/UserProgressContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }) {
  return (
    <AuthProvider>
      <UserProgressContextProvider>
        <CartContextProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </CartContextProvider>
      </UserProgressContextProvider>
    </AuthProvider>
  );
}
