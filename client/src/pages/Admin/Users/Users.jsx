import { Alert, Modal, message as msg } from "antd";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.jsx";
import Spinner from "../../../components/Spinner.jsx";
import {
  hideLoading,
  showLoading,
} from "../../../redux/features/spinnerSlice.js";
import "./Users.css";

export default function Users() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState();

  const getUsers = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/get-all-users`,
        { headers: { Authorization: "Bearer " + token } }
      );

      const { success, users } = response.data;
      if (success) {
        setUsers(users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeRole = async (e, id, token) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.put(
        `http://localhost:5000/api/admin/change-user-role/${id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
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

  const deleteUser = async (e, id, token) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.delete(
        `http://localhost:5000/api/admin/delete-user/${id}`,
        { headers: { Authorization: "Bearer " + token } }
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

  useEffect(() => {
    getUsers(Cookies.get("token"));
  }, []);
  return (
    <AdminLayout>
      <div className="users-container">
        <h1>ALL USERS</h1>
        <table className="room-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Subscription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users ? (
              users.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role === "admin" ? "Admin" : "User"}</td>
                  <td>{item.subscription?.status}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        if (item.role === "user") {
                          Modal.confirm({
                            title: "Confirm",
                            content: `Are you sure you want to make this user ${item.name} ?`,
                            onOk() {
                              changeRole(e, item._id, Cookies.get("token"));
                            },
                          });
                        } else {
                          msg.warning("You can't change role of an admin.");
                        }
                      }}
                    >
                      Change Role
                    </button>
                    <ion-icon
                      disabled={item.role === "admin" ? true : false}
                      name="trash"
                      onClick={(e) => {
                        if (item.role === "user") {
                          Modal.confirm({
                            title: "Confirm",
                            content: `Are you sure you want to delete this ${item.name} ?`,
                            onOk() {
                              deleteUser(e, item._id, Cookies.get("token"));
                            },
                          });
                        } else {
                          msg.warning("You can't delete an admin.");
                        }
                      }}
                    ></ion-icon>
                  </td>
                </tr>
              ))
            ) : (
              <Spinner />
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
