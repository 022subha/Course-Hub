import React from "react";
import Navbar from "../../components/Layout/Navbar/Navbar";
import "./ResetPassword.css";

export default function ResetPassword() {
  return (
    <>
      <Navbar />
      <div className="reset-password">
        <div className="banner">
          <span>Reset Password</span>
        </div>
        <div className="reset-form">
          <form>
            <h3>New Password</h3>
            <p>
              Please create a new password that you don't use on any other site.
            </p>
            <input type="password" placeholder="Create new password" />
            <input type="password" placeholder="Confirm your password" />
            <button>Change</button>
          </form>
        </div>
      </div>
    </>
  );
}
