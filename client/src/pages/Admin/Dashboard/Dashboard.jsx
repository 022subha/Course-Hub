import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout/AdminLayout.jsx";
import BarChart from "./BarChart.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const [data, setData] = useState();

  const getDashboardInfo = async () => {
    try {
      const response = await axios.get(
        `https://api-coursehub.onrender.com/api/admin/dashboard-stat`,
        { headers: { Authorization: "Bearer " + Cookies.get("token") } }
      );
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardInfo();
  }, []);
  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="admin-card-row">
          <div className="admin-card views">
            <div className="title">
              <h3>Views</h3>
            </div>
            <div className="data">
              <p>{data?.views}</p>
              <div className="progress">
                <span>30%</span>
                <ion-icon name="arrow-up" style={{ color: "green" }}></ion-icon>
              </div>
            </div>
            <div className="desc">
              <span>Since Last Month</span>
            </div>
          </div>
          <div className="admin-card users">
            <div className="title">
              <h3>Users</h3>
            </div>
            <div className="data">
              <p>{data?.users}</p>
              <div className="progress">
                <span>30%</span>
                <ion-icon name="arrow-up" style={{ color: "green" }}></ion-icon>
              </div>
            </div>
            <div className="desc">
              <span>Since Last Month</span>
            </div>
          </div>
          <div className="admin-card subscriptions">
            <div className="title">
              <h3>Subscriptions</h3>
            </div>
            <div className="data">
              <p>{data?.subscriptions}</p>
              <div className="progress">
                <span>30%</span>
                <ion-icon name="arrow-up" style={{ color: "green" }}></ion-icon>
              </div>
            </div>
            <div className="desc">
              <span>Since Last Month</span>
            </div>
          </div>
        </div>
        <div className="bar-chart">
          <div className="heading">Progress Bar</div>
          <BarChart dataset={data} />
        </div>
      </div>
    </AdminLayout>
  );
}
