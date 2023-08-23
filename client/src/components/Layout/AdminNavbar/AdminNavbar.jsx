import React from "react";
import "./AdminNavbar.css";

export default function AdminNavbar({ showSidebar, setShowSidebar }) {
  return (
    <div className="admin-navbar-container">
      <div className="responsive-burger-menu">
        <ion-icon
          name="menu"
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
        ></ion-icon>
      </div>
      <div className="main">
        <div className="notification">
          <ion-icon name="notifications"></ion-icon>
          <p>1</p>
        </div>
        <div className="user">
          <img src="/assets/images/about.jpg" alt="" />
        </div>
      </div>
    </div>
  );
}
