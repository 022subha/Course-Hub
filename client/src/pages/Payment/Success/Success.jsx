import React from "react";
import { Link } from "react-router-dom";
import "./Success.css";

export default function Success() {
  return (
    <>
      <div className="success-container">
        <h1>You Have Iconic Pack</h1>
        <div className="card">
          <div className="payment">
            <ion-icon name="checkmark"></ion-icon>
            <span>Payment Successful</span>
          </div>
          <div className="desc">
            <span>
              Congratulations !! You are a Iconic user now. You have access to
              our premium content.
            </span>
          </div>
          <div className="btn">
            <Link to="/profile">
              <button>Go to Profile</button>
            </Link>

            <Link to="/">
              <button>Homepage</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
