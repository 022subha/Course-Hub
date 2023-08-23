import React from "react";
import Navbar from "../../components/Layout/Navbar/Navbar";
import "./Contact.css";

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="contact-container">
        <div className="banner">
          <p>Get In Touch</p>
          <p>The Ultimate Guide to Ace SDE Interviews.</p>
        </div>
        <div className="contact-form">
          <div className="form-items">
            <div className="header">
              <h3>Send us a message</h3>
              <ion-icon name="mail-outline"></ion-icon>
            </div>
            <form>
              <ul>
                <li>
                  <input type="text" id="name" />
                  <label htmlFor="name">Name</label>
                </li>
                <li>
                  <input type="email" id="email" />
                  <label htmlFor="email">Email</label>
                </li>
                <li>
                  <input id="phone" type="text" />
                  <label htmlFor="phone">Phone Number</label>
                </li>
                <li>
                  <input id="subject" type="text" />
                  <label htmlFor="subject">Subject</label>
                </li>
                <li>
                  <input id="message" />
                  <label htmlFor="message">Message</label>
                </li>
              </ul>
              <button type="submit">
                <span>Submit</span>
                <ion-icon name="paper-plane-sharp"></ion-icon>
              </button>
            </form>
          </div>
          <div className="icons">
            <h3>Contact Information</h3>
            <div className="information">
              <div className="item" id="mail">
                <ion-icon name="mail"></ion-icon>
                <span>support@coursehub.in</span>
              </div>
              <div className="item" id="location">
                <ion-icon name="location"></ion-icon>
                <span>
                  IIEST,Shibpur
                  <br />
                  Botanic Garden, Howrah-711103
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
