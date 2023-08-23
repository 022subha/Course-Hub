import { message } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar.jsx";
import makePayment from "../../utils/paymentsUtils.js";
import "./Plans.css";

const PlanCard = ({ title, included, excluded, color, price }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const handlePayment = async (e, amount) => {
    e.preventDefault();
    if (user) {
      if (user?.subscription?.status === "active") {
        message.warning("You allready have an active subscription.");
      } else {
        makePayment(amount, user, title);
      }
    } else {
      message.error("Login First !!");
      navigate("/login");
    }
  };
  return (
    <div className="plan-card-container">
      <h2 style={{ color }}>{title}</h2>
      <ul>
        {included.map((item, index) => (
          <li id="include" key={index}>
            <ion-icon name="checkmark"></ion-icon>
            <span>{item}</span>
          </li>
        ))}
        {excluded.map((item, index) => (
          <li id="exclude" key={index}>
            <ion-icon name="close"></ion-icon>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="price">
        <p>₹ {price}</p>
        <span>per month</span>
      </div>

      <button
        style={{ backgroundColor: color }}
        onClick={(e) => handlePayment(e, price)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default function Plans() {
  const included1 = ["Interactive Live Classes", "Printed Notes"];
  const excluded1 = ["1:1 Live Mentorship"];
  const included2 = [
    "Interactive Live Classes",
    "Printed Notes",
    "1:1 Live Mentorship",
  ];
  const excluded2 = [];
  return (
    <>
      <Navbar />
      <div className="plans-container">
        <div className="banner">
          <span>Subscription Plans</span>
          <span>Select a Subscription Plan that suits you</span>
        </div>
        <div className="plans">
          <PlanCard
            title="Iconic"
            included={included2}
            excluded={excluded2}
            color="goldenrod"
            price={799}
          />
          <PlanCard
            title="Plus"
            included={included1}
            excluded={excluded1}
            color="#e70b53"
            price={299}
          />
        </div>
      </div>
    </>
  );
}
