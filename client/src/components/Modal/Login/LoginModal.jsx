import { message as msg } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { hideLoading, showLoading } from "../../../redux/features/spinnerSlice";
import { setUser } from "../../../redux/features/userSlice";
import "./LoginModal.css";

export default function LoginModal({ closeModal, setIsLogin }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const toggleShowPass = () => {
    setShowPass(!showPass);
  };

  const getUser = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/user/my-profile`,
        { headers: { Authorization: "Bearer " + token } }
      );
      dispatch(setUser(response.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/api/user/login`,
        { email, password }
      );
      dispatch(hideLoading());
      const { success, message, token } = response.data;
      if (success) {
        Cookies.set("token", token, { expires: 7 });
        msg.success(message);
        closeModal();
        await getUser(token);
        navigate("/");
      } else {
        msg.error(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <form>
        <h2>Sign In</h2>
        <div className="passport">
          <div className="log">
            <img src="/assets/images/gl.svg" alt="" />
            <h5>Continue With Google</h5>
          </div>
        </div>
        <div className="horizontal-line">
          <div className="line1"></div>
          <span>OR</span>
          <div className="line2"></div>
        </div>

        <div className="input-box">
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
        </div>
        <div className="remember-forget">
          {/* <Link to="/forgot-password" onClick={closeModal}>
            Forgot Password?
          </Link> */}
        </div>
        <button type="submit" className="btn" onClick={(e) => handleLogin(e)}>
          Login
        </button>
        <div className="login-register">
          <p>
            Don't Have an Account?
            <span
              className="register-link"
              onClick={() => {
                setIsLogin(false);
              }}
            >
              Register
            </span>
          </p>
        </div>
        <div className="close-icon" onClick={closeModal}>
          <ion-icon name="close" />
        </div>
      </form>
    </div>
  );
}
