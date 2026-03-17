"use client";

import ProtectedRoute from "components/ProtectedRoute";
import AdminLayoutComponent from "Admin/components/AdminLayout/AdminLayout";
import "Admin/adminIndex.css";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </ProtectedRoute>
  );
}
