import React, { useState } from "react";
import AdminNavbar from "../AdminNavbar/AdminNavbar.jsx";
import AdminSidebar from "../AdminSidebar/AdminSidebar.jsx";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className="admin-layout-container">
      <AdminSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="main-container">
        <AdminNavbar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
        <div className="body">{children}</div>
      </div>
    </div>
  );
}
