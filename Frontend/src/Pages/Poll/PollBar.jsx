import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const PollBar = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const labels = [1, 2, 3];

  const data = {
    labels,
    datasets: [
      {
        data: [10, 20, 30],
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default PollBar;
