import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ dataset }) {
  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    layout: {
      padding: 20,
    },
  };

  const labels =
    window.innerWidth < 600
      ? ["", "", ""]
      : ["Users", "Views", "Subscriptions"];

  const data = {
    labels,
    datasets: [
      {
        data: [dataset?.users, dataset?.views, dataset?.subscriptions],
        borderColor: ["#ff0000", "#00ff00", "#0000ff"],
        backgroundColor: ["#ff0000", "#00ff00", "#0000ff"],
        barThickness: window.innerWidth < 600 ? "10" : "50",
        borderRadius: 10,
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
