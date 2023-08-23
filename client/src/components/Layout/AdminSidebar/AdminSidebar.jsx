import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar({ showSidebar, setShowSidebar }) {
  return (
    <div
      className={
        showSidebar
          ? "admin-sidebar-container active"
          : "admin-sidebar-container"
      }
    >
      <div className="logo">
        <h3>Course Hub</h3>
        <ion-icon
          name="close"
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
        ></ion-icon>
      </div>
      <div className="links">
        <ul>
          <li>
            <NavLink activeclassname="active" to="/">
              <ion-icon name="home"></ion-icon>
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/admin/dashboard">
              <ion-icon name="grid"></ion-icon>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/admin/create-course">
              <ion-icon name="add-circle"></ion-icon>
              <span>Create Course</span>
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/admin/courses">
              <ion-icon name="laptop"></ion-icon>
              <span>Courses</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users">
              <ion-icon name="people"></ion-icon>
              <span>Users</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
