"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayoutComponent from "@/src/Admin/components/AdminLayout/AdminLayout";
import "@/src/Admin/adminIndex.css";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </ProtectedRoute>
  );
}
