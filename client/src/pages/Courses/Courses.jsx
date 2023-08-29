import { message as msg } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar";
import { hideLoading, showLoading } from "../../redux/features/spinnerSlice";
import { setUser } from "../../redux/features/userSlice";
import "./Courses.css";

const CourseCard = ({ item }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const addToPlaylist = async (e, id) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.post(
        `https://api-coursehub.onrender.com/api/user/add-to-playlist`,
        { id },
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );
      dispatch(hideLoading());
      const { success, message, updatedUser } = response.data;
      if (success) {
        msg.success(message);
        dispatch(setUser(updatedUser));
        navigate("/profile");
      } else {
        msg.error(message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  return (
    <div className="card">
      <img src={item.poster.url} alt="" />
      <div className="data">
        <h2>{item.title}</h2>

        <div className="btn">
          <Link
            to={
              user?.role === "admin" || user?.subscription?.status === "active"
                ? `/course/${item._id}`
                : `/plans`
            }
            onClick={() => {
              if (
                user?.role !== "admin" &&
                user?.subscription?.status !== "active"
              ) {
                msg.warning(
                  "You does not have an active subscrription. Sunscribe first."
                );
              }
            }}
          >
            <button>Watch Now</button>
          </Link>
          <button id="playlist" onClick={(e) => addToPlaylist(e, item._id)}>
            Add to Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Courses() {
  const [courses, setCourses] = useState();

  const getCourses = async () => {
    try {
      const response = await axios.get(
        `https://api-coursehub.onrender.com/api/course/get-all-courses`
      );

      const { success, allCourses } = response.data;
      if (success) {
        setCourses(allCourses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  });

  return (
    <>
      <Navbar />
      <div className="courses-container">
        <div className="banner">
          <span>All Courses</span>
        </div>
        <div className="main-area">
          <div className="courses-area">
            {courses?.map((item, index) => (
              <CourseCard item={item} key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
