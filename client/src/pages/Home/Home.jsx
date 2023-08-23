import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar";
import "./Home.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="body-container">
        <div className="description">
          <h3>Learn From The Experts</h3>
          <p>The Ultimate Guide to Ace Coding Interviews</p>
          <button>
            <Link to="/courses">View Courses</Link>
          </button>
        </div>
        <div className="logo">
          <img src="/assets/images/logo.png" alt="" />
        </div>
      </div>
    </>
  );
}
