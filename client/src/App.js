import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import About from "./pages/About/About";
import AdminCourses from "./pages/Admin/Courses/AdminCourses";
import CreateCourse from "./pages/Admin/CreateCourse/CreateCourse";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import Users from "./pages/Admin/Users/Users";
import Contact from "./pages/Contact/Contact";
import Courses from "./pages/Courses/Courses";
import Home from "./pages/Home/Home";
import Lecture from "./pages/Lecture/Lecture";
import ForgotPassword from "./pages/Password/ForgotPassword";
import ResetPassword from "./pages/Password/ResetPassword";
import Success from "./pages/Payment/Success/Success";
import Plans from "./pages/Plans/Plans";
import Profile from "./pages/Profile/Profile";
import { hideLoading, showLoading } from "./redux/features/spinnerSlice";
import { setUser } from "./redux/features/userSlice";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.spinner);

  const getUser = async (token) => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        `https://api-coursehub.onrender.com/api/user/my-profile`,
        { headers: { Authorization: "Bearer " + token } }
      );
      dispatch(hideLoading());
      dispatch(setUser(response.data.user));
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      getUser(token);
    }
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/payment-success" element={<Success />} />
            <Route path="/payment-fail" element={<Success />} />
            {(user?.role === "admin" ||
              user?.subscription?.status === "active") && (
              <Route path="/course/:courseId" element={<Lecture />} />
            )}
            {user && <Route path="/profile" element={<Profile />} />}
            {user?.role === "admin" && (
              <Route path="/admin/dashboard" element={<Dashboard />} />
            )}
            {user?.role === "admin" && (
              <Route path="/admin/create-course" element={<CreateCourse />} />
            )}
            {user?.role === "admin" && (
              <Route path="/admin/users" element={<Users />} />
            )}
            {user?.role === "admin" && (
              <Route path="/admin/courses" element={<AdminCourses />} />
            )}
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
