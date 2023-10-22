import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar.jsx";
import "./About.css";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="banner">
          <span>About Us</span>
        </div>

        <div className="about">
          <div className="image">
            <img src="https://images.unsplash.com/photo-1453396450673-3fe83d2db2c4?auto=format&fit=crop&q=80&w=1887&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
          <div className="info">
            <h3>About Us</h3>
            <p>
              Hello! Welcome to <span id="bold">Course Hub!</span> Really happy
              to see you here.
            </p>
            <span>
              Thinking of taking a step towards a mentorship programme? It
              definitely seems a bit daunting at first. It is never easy to ask
              for someone's counsel or guidance be it for studies or just in
              general. So, at <span id="bold">Course Hub</span> we are here to
              provide all the necessary counsel you might need for{" "}
              <span id="bold">placement preparations</span>,{" "}
              <span id="bold">interview experiences</span>,{" "}
              <span id="bold">programming</span>, et cetera! For any additional
              questions, feel free to email us at{" "}
              <span id="bold">subhajit@coursehub.in</span>
            </span>
          </div>
        </div>

        <div className="plan">
          <p>
            Unlock a world of limitless learning opportunities by choosing our
            checkout plan. With access to thousands of high-quality courses, our
            plan enables you to expand your knowledge and acquire valuable
            skills.
          </p>
          <Link to="/plans">
            <button>Checkout Our Plan</button>
          </Link>
        </div>
      </div>
    </>
  );
}
