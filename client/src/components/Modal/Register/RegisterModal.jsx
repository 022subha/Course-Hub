import { Avatar, message as msg } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  hideLoading,
  showLoading,
} from "../../../redux/features/spinnerSlice.js";
import "./RegisterModal.css";

export default function RegisterModal({ closeModal, setIsLogin }) {
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [file, setFile] = useState();
  const [imagePrev, setImagePrev] = useState();

  const toggleShowPass = () => {
    setShowPass(!showPass);
  };

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePrev(reader.result);
        setFile(file);
      };
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const bodyContent = new FormData();
      bodyContent.append("name", name);
      bodyContent.append("email", email);
      bodyContent.append("password", password);
      bodyContent.append("file", file);
      dispatch(showLoading());
      const response = await axios.post(
        `https://api-coursehub.onrender.com/api/user/register`,
        bodyContent
      );
      dispatch(hideLoading());
      const { success, message } = response.data;
      if (success) {
        msg.success(message);
      } else {
        msg.error(message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  return (
    <>
      <div className="register-container">
        <form>
          <h2>Sign Up</h2>

          <div className="avatar">
            <Avatar
              size={100}
              icon={<ion-icon name="person" />}
              src={imagePrev}
            />
          </div>

          <div className="input-box">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <span className="icon">
              <ion-icon
                name={showPass ? "eye-off" : "eye"}
                onClick={toggleShowPass}
              ></ion-icon>
            </span>
            <label htmlFor="password">Password</label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label htmlFor="avatar">Avatar</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Choose your avatar"
              onChange={changeImageHandler}
            />
          </div>

          <button
            type="submit"
            className="btn"
            onClick={(e) => {
              handleRegister(e);
            }}
          >
            Register
          </button>
          <div className="login-register">
            <p>
              Already Have an Account?
              <span
                className="register-link"
                onClick={() => {
                  setIsLogin(true);
                }}
              >
                Login
              </span>
            </p>
          </div>
          <div className="close-icon" onClick={closeModal}>
            <ion-icon name="close" />
          </div>
        </form>
      </div>
    </>
  );
}
