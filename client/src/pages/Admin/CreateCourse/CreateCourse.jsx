import { message as msg } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.jsx";
import {
  hideLoading,
  showLoading,
} from "../../../redux/features/spinnerSlice.js";
import "./CreateCourse.css";

export default function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [imagePrev, setImagePrev] = useState();
  const [file, setFile] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [creator, setCreator] = useState();
  const [category, setCategory] = useState();

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

  const addCourse = async (e) => {
    e.preventDefault();
    try {
      const bodyContent = new FormData();
      bodyContent.append("title", title);
      bodyContent.append("description", description);
      bodyContent.append("createdBy", creator);
      bodyContent.append("category", category);
      bodyContent.append("file", file);
      dispatch(showLoading());
      const response = await axios.post(
        `http://localhost:5000/api/course/create-course`,
        bodyContent,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );
      dispatch(hideLoading());

      const { success, message } = response.data;
      if (success) {
        msg.success(message);
        navigate("/admin/courses");
      } else {
        msg.error(message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="create-course-container">
        <form>
          <h1>Add a Course</h1>
          <ul>
            <li>
              <label>Course Title</label>
              <input
                type="text"
                placeholder="Title"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                required
              />
            </li>
            <li>
              <label>Creator</label>
              <input
                type="text"
                placeholder="Creator"
                onChange={(e) => {
                  setCreator(e.target.value);
                }}
                required
              />
            </li>
            <li>
              <label>Course Description</label>
              <input
                type="text"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </li>
            <li>
              <label>Category</label>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value={null}>Select a Category...</option>
                <option value="Web Development">Web Development</option>
                <option value="Web Development">Web Development</option>
                <option value="Web Development">Web Development</option>
              </select>
            </li>
            <li>
              <label>Thumbnail</label>
              <input
                type="file"
                onChange={changeImageHandler}
                accept="image/*"
                required
              />
            </li>
            <li>
              <img
                src={imagePrev ? imagePrev : "/assets/images/no-image.svg"}
                alt=""
                style={!imagePrev ? { height: "250px" } : {}}
              />
            </li>
          </ul>

          <button
            onClick={(e) => {
              addCourse(e);
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
