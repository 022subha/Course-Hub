import React from "react";
import Navbar from "../../components/Layout/Navbar/Navbar.jsx";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  return (
    <>
      <Navbar />
      <div className="forgot-password">
        <div className="banner">
          <span>Forgot Password</span>
        </div>
        <div className="forget-form">
          <form>
            <h3 htmlFor="email">Enter Your Email Address</h3>
            <input type="email" placeholder="Enter your email address" />
            <button>Continue</button>
          </form>
        </div>
      </div>
    </>
  );
}
