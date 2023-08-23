import { Modal as mod, message as msg } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.jsx";
import LectureModal from "../../../components/Modal/Lecture/LectureModal.jsx";
import {
  hideLoading,
  showLoading,
} from "../../../redux/features/spinnerSlice.js";
import "./AdminCourses.css";

export default function AdminCourses() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [singleCourse, setSingleCourse] = useState();
  const customStyles = {
    content: {
      zIndex: 3,
      padding: 0,
      margin: 0,
      border: "none",
      minHeight: "100vh",
      width: "100vw",
      inset: "0",
      borderRadius: 0,
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.6)",
      zIndex: 3,
    },
  };

  const openModal = (course) => {
    setShowModal(true);
    setSingleCourse(course);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/course/get-all-courses`
      );

      const { success, allCourses } = response.data;
      if (success) {
        setCourses(allCourses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      const token = Cookies.get("token");
      mod.confirm({
        title: "Confirm",
        content: "Are you sure to delete this course?",
        async onOk() {
          dispatch(showLoading());
          const response = await axios.delete(
            `http://localhost:5000/api/course/delete-course/${id}`,
            { headers: { Authorization: "Bearer " + token } }
          );
          dispatch(hideLoading());
          const { message, success } = response.data;

          if (success) {
            msg.success(message);
          } else {
            msg.error(message);
          }
        },
      });
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);
  return (
    <>
      <AdminLayout>
        <div className="admin-courses-container">
          <h1>ALL COURSES</h1>
          <table className="course-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Category</th>
                <th>Creator</th>
                <th>Views</th>
                <th>Lectures</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img src={item.poster.url} alt="" />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.createdBy.name}</td>
                  <td>{item.views}</td>
                  <td>{item.noOfVideos}</td>
                  <td>
                    <button onClick={() => openModal(item)}>
                      View Lectures
                    </button>
                    <ion-icon
                      name="trash"
                      onClick={() => deleteCourse(item._id)}
                    ></ion-icon>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
      {showModal ? (
        <Modal
          contentLabel="Add Lecture Modal"
          ariaHideApp={false}
          isOpen={showModal}
          style={customStyles}
        >
          <LectureModal closeModal={closeModal} course={singleCourse} />
        </Modal>
      ) : undefined}
    </>
  );
}
