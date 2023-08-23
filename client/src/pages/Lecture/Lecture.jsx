import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar.jsx";
import Spinner from "../../components/Spinner.jsx";
import "./Lecture.css";

export default function Lecture() {
  const { courseId } = useParams();
  const [lectures, setLectures] = useState();
  const [active, setActive] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const getCourseDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/course/get-all-lectures/${courseId}`,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );

      const { success, courseData } = response.data;
      if (success) {
        setLectures(courseData);
        console.log(courseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoLoadedMetadata = (e) => {
    setVideoDuration(e.target.duration);
  };

  useEffect(() => {
    getCourseDetails();
  }, []);

  return (
    <>
      <Navbar />
      <div className="lecture-container">
        {lectures ? (
          <>
            <div className="left">
              <h1>{lectures?.title}</h1>
              <div className="video">
                <video
                  key={lectures?.lectures[active]?.video.url}
                  loop
                  controls
                  preload="auto"
                  onLoadedMetadata={handleVideoLoadedMetadata}
                >
                  <source
                    src={
                      lectures.lectures.length &&
                      lectures.lectures[active]?.video.url
                    }
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="desc">
                <p>
                  {lectures.lectures.length &&
                    `${active + 1} .${lectures.lectures[active]?.title}`}
                </p>
                <span>
                  {lectures.lectures.length &&
                    lectures.lectures[active]?.description}
                </span>
              </div>
            </div>
            <div className="right">
              <h1>Course Content</h1>
              <ol>
                {lectures.lectures.map((item, index) => (
                  <li
                    className={index === active ? "active" : undefined}
                    key={index}
                    onClick={() => {
                      setActive(index);
                    }}
                  >
                    <div className="name">
                      <span>{index + 1}.</span>
                      {item.title}
                    </div>
                    <div className="time">
                      <ion-icon name="videocam"></ion-icon>
                      <span>{"10"} min</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : (
          <Spinner />
        )}
      </div>
    </>
  );
}
