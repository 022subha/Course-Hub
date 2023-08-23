import { Modal, message as msg } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar.jsx";
import { hideLoading, showLoading } from "../../redux/features/spinnerSlice.js";
import { setUser } from "../../redux/features/userSlice.js";
import "./Profile.css";

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const removeFromPlaylist = async (id) => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `http://localhost:5000/api/user/remove-from-playlist/${id}`,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );
      dispatch(hideLoading());
      const { success, message, updatedUser } = response.data;
      if (success) {
        msg.success(message);
        dispatch(setUser(updatedUser));
      } else {
        msg.error(message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  const unSubscribe = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `http://localhost:5000/api/payment/cancel-subscription`,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );
      dispatch(hideLoading());
      const { success, message, updatedUser } = response.data;
      if (success) {
        msg.success(message);
        dispatch(setUser(updatedUser));
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
      <Navbar />
      <div className="profile-container">
        <div className="profile">
          <div className="photo">
            <img src={user?.avatar?.url} alt="" />
          </div>
          <div className="desc">
            <h3>{user?.name}</h3>
            <p>Email : {user?.email}</p>
            <p>
              Created At :
              {user && new Date(user?.createdAt).toISOString().split("T")[0]}
            </p>
            {user?.role === "user" && (
              <span>
                Subscription :
                {user?.subscription?.status === "active" ? "Iconic" : "None"}
              </span>
            )}
            {user.role !== "admin" &&
              (user?.role === "user" &&
              user?.subscription?.status !== "active" ? (
                <Link to="/plans">
                  <button>Subscribe</button>
                </Link>
              ) : (
                <Link
                  to=""
                  onClick={() => {
                    Modal.confirm({
                      title: "Confirm",
                      content: "Are you sure you want to unsubscribe ?",
                      onOk() {
                        if (user.subscription.status === "active") {
                          unSubscribe();
                        }
                      },
                    });
                  }}
                >
                  <button>Unsubscribe</button>
                </Link>
              ))}
          </div>
        </div>
        <div className="playlist">
          <h3>Playlist</h3>
          {user?.playlist.length ? (
            <ul>
              {user.playlist.map((item, index) => (
                <li key={index}>
                  <img src="/assets/images/course-logo.jpg" alt="" />
                  <div className="btn">
                    <Link
                      to={
                        user?.role === "admin" ||
                        user?.subscription?.status === "active"
                          ? `/course/${item.course}`
                          : `/plans`
                      }
                      onClick={() => {
                        if (
                          user?.role !== "admin" ||
                          user?.subscription?.status !== "active"
                        ) {
                          msg.warning(
                            "You does not have an active subscrription. Sunscribe first."
                          );
                        }
                      }}
                    >
                      <button>Watch now</button>
                    </Link>
                    <Link
                      to={``}
                      onClick={() => {
                        Modal.confirm({
                          title: "Confirm",
                          content:
                            "Are you sure you want to delete this course from playlist ?",
                          onOk() {
                            removeFromPlaylist(item.course);
                          },
                        });
                      }}
                    >
                      <button>Remove from Playlist</button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <ul>
              <li>No Courses in the playlist.</li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
