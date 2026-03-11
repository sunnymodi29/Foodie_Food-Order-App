import logoImg from "@/public/images/logo.jpg";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/src/Admin/components/Sidebar/Sidebar.css";
import {
  AlignLeft,
  X,
  LayoutDashboard,
  Utensils,
  ClipboardList,
  SquareMenu,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <>
      {!isOpen && (
        <div className="hamburger" onClick={() => setIsOpen(true)}>
          <AlignLeft size={30} />
        </div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src={logoImg.src || logoImg} alt="Foodie Logo" />
            <h1>Foodie</h1>
          </div>
          {isOpen && (
            <div className="sidebar-close" onClick={closeSidebar}>
              <X size={26} />
            </div>
          )}
        </div>

        <nav className="sidebar-links" onClick={closeSidebar}>
          <Link
            href="/admin/dashboard"
            className={isActive("/admin/dashboard") ? "active" : ""}
          >
            <LayoutDashboard size={18} className="sidebar-icon" />
            Dashboard
          </Link>
          <Link
            href="/admin/addmeals"
            className={isActive("/admin/addmeals") ? "active" : ""}
          >
            <Utensils size={18} className="sidebar-icon" />
            Add Meals
          </Link>
          <Link
            href="/admin/orders"
            className={isActive("/admin/orders") ? "active" : ""}
          >
            <ClipboardList size={18} className="sidebar-icon" />
            Orders
          </Link>
          <Link
            href="/admin/menu"
            className={isActive("/admin/menu") ? "active" : ""}
          >
            <SquareMenu size={18} className="sidebar-icon" />
            Menu
          </Link>
        </nav>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
    </>
  );
}

