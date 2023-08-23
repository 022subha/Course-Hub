import { Avatar, Modal as mod, message as msg } from "antd";
import Cookies from "js-cookie";
import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { setUser } from "../../../redux/features/userSlice";
import LoginModal from "../../Modal/Login/LoginModal";
import RegisterModal from "../../Modal/Register/RegisterModal";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customStyles = {
    content: {
      width: "100%",
      height: "100%",
      margin: "auto",
      border: "none",
      backgroundColor: "transparent",
      inset: "0",
      zIndex: 3,
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.6)",
      zIndex: 3,
    },
  };

  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showResProfileMenu, setShowResProfileMenu] = useState(false);

  const toogleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toogleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const toogleResProfileMenu = () => {
    setShowResProfileMenu(!showResProfileMenu);
  };

  const openModal = () => {
    setShowMenu(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    mod.confirm({
      title: "Confirm",
      content: "Are you sure you want to logout?",
      onOk() {
        Cookies.remove("token");
        dispatch(setUser(null));
        toogleProfileMenu();
        navigate("/");
        msg.success("Logged out successfully.");
      },
    });
  };

  return (
    <>
      {showMenu && <div className="overlay" onClick={toogleMenu}></div>}
      {showMenu && (
        <div
          className={!showMenu ? "menu-container" : "menu-container show-menu"}
        >
          <ul className="menu-links">
            <li>
              <Link to="/" onClick={toogleMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/courses" onClick={toogleMenu}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={toogleMenu}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={toogleMenu}>
                Contact
              </Link>
            </li>
            {!user ? (
              <li>
                <button onClick={openModal}>
                  <Link to="">Login</Link>
                </button>
              </li>
            ) : (
              <li>
                <div className="res-profile" onClick={toogleResProfileMenu}>
                  <Avatar
                    src={user.avatar.url}
                    size={50}
                    icon={<ion-icon name="person" />}
                  />
                  <span>{user.name}</span>
                  <ion-icon
                    name={showResProfileMenu ? "chevron-up" : "chevron-down"}
                  ></ion-icon>
                </div>
              </li>
            )}
          </ul>

          {showResProfileMenu && (
            <div className="res-profile-menu">
              <ul>
                <li>
                  <Link to="/admin/dashboard">
                    <ion-icon name="grid"></ion-icon>
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="/profile">
                    <ion-icon name="person"></ion-icon>
                    <span>Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="" onClick={handleLogout}>
                    <ion-icon name="log-out"></ion-icon>
                    <span>Logout</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      {isLogin ? (
        <Modal
          contentLabel="Login Modal"
          ariaHideApp={false}
          isOpen={showModal}
          style={customStyles}
        >
          <LoginModal closeModal={closeModal} setIsLogin={setIsLogin} />
        </Modal>
      ) : (
        <Modal
          contentLabel="Register Modal"
          ariaHideApp={false}
          isOpen={showModal}
          style={customStyles}
        >
          <RegisterModal closeModal={closeModal} setIsLogin={setIsLogin} />
        </Modal>
      )}
      {showProfileMenu && (
        <div className="profile-menu">
          <ul>
            {user?.role === "admin" && (
              <li>
                <Link to="/admin/dashboard">
                  <ion-icon name="grid"></ion-icon>
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
            <li>
              <Link to="/profile">
                <ion-icon name="person"></ion-icon>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="" onClick={handleLogout}>
                <ion-icon name="log-out"></ion-icon>
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
      <div className="nav-container">
        <nav>
          <div className="logo">
            <p>Course Hub</p>
          </div>
          <div className="links">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/courses">Courses</Link>
              </li>

              <li>
                <Link to="/about">About Us</Link>
              </li>

              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          {!user ? (
            <div className="buttons">
              <button onClick={openModal}>Login</button>
            </div>
          ) : (
            <div className="profile" onClick={toogleProfileMenu}>
              <Avatar
                src={user.avatar.url}
                size={50}
                icon={<ion-icon name="person" />}
              />
              <span>{user.name}</span>
              <ion-icon
                name={showProfileMenu ? "chevron-up" : "chevron-down"}
              ></ion-icon>
            </div>
          )}
          <div className="menu-icon">
            <ion-icon
              name={showMenu ? "close" : "menu"}
              onClick={toogleMenu}
            ></ion-icon>
          </div>
        </nav>
      </div>
    </>
  );
}
