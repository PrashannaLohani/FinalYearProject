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

const BarGraph = () => {
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
        position: "top",
      },
      title: {
        display: true,
        text: "Engagement Level",
      },
    },
  };

  const labels = ["Room1", "Room2", "Room3", "Room4", "Room5", "Room6"];

  const data = {
    labels,
    datasets: [
      {
        label: "Number of people joined",
        data: [20, 30, 40, 30, 20, 10, 25],
        backgroundColor: "rgba(0, 0, 0, 0.8)",
      },
      {
        label: "Number of comments",
        data: [10, 15, 20, 12, 8, 10],
        backgroundColor: "rgba(255, 99, 132, 0.8)", // You can change the color as desired
      },
    ],
  };

  return <Bar options={options} data={data} />;
};

export default BarGraph;
