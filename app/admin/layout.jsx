"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayoutComponent from "@/src/Admin/components/AdminLayout/AdminLayout";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </ProtectedRoute>
  );
}
