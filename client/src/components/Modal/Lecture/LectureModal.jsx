import { Modal, message as msg, Spin } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/spinnerSlice";
import "./LectureModal.css";

const LectureCard = ({ item, index, courseId, lectures, setLectures }) => {
  const dispatch = useDispatch();
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `http://localhost:5000/api/course/delete-lecture?courseId=${courseId}&lectureId=${item._id}`,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );
      dispatch(hideLoading());

      const { success, message } = response.data;
      if (success) {
        msg.success(message);
        setLectures(lectures.filter((item1) => item1._id !== item._id));
      } else {
        msg.error(message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };
  return (
    <div className="lecture-card">
      <div className="desc">
        <h3>
          #{index + 1} {item.title}
        </h3>
        <p>{item.description}</p>
      </div>
      <div
        className="btn"
        onClick={(e) => {
          Modal.confirm({
            title: "Confirm",
            content: "Are you sure to delete this lecture?",
            onOk() {
              handleDelete(e);
            },
          });
        }}
      >
        <ion-icon name="trash"></ion-icon>
      </div>
    </div>
  );
};

export default function LectureModal({ closeModal, course }) {
  const [lectures, setLectures] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [file, setFile] = useState();
  const [videoPrev, setVideoPrev] = useState();
  const [isUploading, setIsUploading] = useState(false);

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setVideoPrev(reader.result);
        setFile(file);
      };
    }
  };

  const getCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/course/get-all-lectures/${course._id}`,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );

      const { success, courseData } = response.data;
      if (success) {
        setLectures(courseData.lectures);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addLecture = async (e, id) => {
    e.preventDefault();
    try {
      const bodyContent = new FormData();
      bodyContent.append("title", title);
      bodyContent.append("description", description);
      bodyContent.append("file", file);
      setIsUploading(true);
      const response = await axios.post(
        `http://localhost:5000/api/course/add-lecture/${id}`,
        bodyContent,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );
      setIsUploading(false);
      const { success, message, lecture } = response.data;

      if (success) {
        msg.success(message);
        setLectures([...lectures, lecture]);
        setTitle();
        setDescription();
        setFile();
        setVideoPrev();
      } else {
        msg.error(message);
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getCourseDetails();
  }, []);
  return (
    <>
      {!isUploading ? (
        <div className="add-lecture-container">
          <div className="lecture-area">
            <div className="title">
              <h1>{course.title}</h1>
              <p>{course.description}</p>
            </div>
            <div className="lectures">
              <h3>Lectures</h3>
              {lectures.length ? (
                lectures.map((item, index) => (
                  <LectureCard
                    item={item}
                    index={index}
                    key={index}
                    courseId={course._id}
                    lectures={lectures}
                    setLectures={setLectures}
                  />
                ))
              ) : (
                <p>No Lecture</p>
              )}
            </div>
          </div>
          <div className="form-container">
            <h3>Add Lecture</h3>
            <form>
              <ul>
                <li>
                  <input
                    type="text"
                    placeholder="Title"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </li>
                <li>
                  <input
                    type="text"
                    placeholder="Description"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </li>
                <li>
                  <input type="file" onChange={changeVideoHandler} />
                </li>
              </ul>

              {videoPrev && (
                <video loop controls preload="auto">
                  <source src={videoPrev} />
                </video>
              )}
              <button onClick={(e) => addLecture(e, course._id)}>Submit</button>
            </form>
          </div>
          <div className="close-icon" onClick={closeModal}>
            <ion-icon name="close" />
          </div>
        </div>
      ) : (
        <div className="upload-spinner">
          <Spin size="large" />
          <p>Uploading video...</p>
        </div>
      )}
    </>
  );
}
