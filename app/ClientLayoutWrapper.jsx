"use client";

import { useAuth } from "@/src/store/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import Checkout from "@/components/Checkout";
import ScrollToTopButton from "@/components/UI/ScrollToTopButton";

export default function ClientLayoutWrapper({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/404"
  ];

  const isResetPasswordRoute = pathname?.startsWith("/reset-password");

  const isPublicRoute =
    publicRoutes.includes(pathname) || isResetPasswordRoute;

  useEffect(() => {
    if (loading) return;

    // Redirect if not logged in
    if (!user && !isPublicRoute) {
      router.push("/login");
      return;
    }

    // Redirect admin from home to dashboard
    if (user?.admin && pathname === "/") {
      router.replace("/admin/dashboard");
    }

  }, [user, pathname, loading, router]);

  const shouldShowHeader = user && !publicRoutes.includes(pathname) && !isResetPasswordRoute;

  // Stop rendering until auth check completes
  if (loading) return null;

  if (!user && !isPublicRoute) return null;

  return (
    <>
      <ScrollToTopButton />
      {shouldShowHeader && <Header />}
      <Cart />
      <Checkout />
      {children}
    </>
  );
}
