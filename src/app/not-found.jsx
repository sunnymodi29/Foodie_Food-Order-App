"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "components/UI/Button";
import { useAuth } from "@/store/AuthContext";
import { useNotFound } from "@/store/NotFoundContext";

export default function NotFound() {
  const router = useRouter();
  const { user } = useAuth();
  const { setIsNotFound } = useNotFound();

  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false); // Reset when navigating away
  }, [setIsNotFound]);

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-description">
          The page you are looking for is unavailable.
        </p>
        <div className="not-found-actions">
          <Button
            onClick={() => router.push(user?.admin ? "/admin/dashboard" : "/")}
          >
            Go to Homepage
          </Button>
          <Button
            textOnly
            onClick={() => router.back()}
            className="secondary-button"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
