import React from "react";
import { Box } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
      display: true,
      position: "top",
    },
    title: {
      display: true,
      text: "Poll Result",
    },
  },
  scales: {
    y: {
      display: false, // Hide Y-axis
    },
    x: {
      grid: {
        display: false, // Hide grid lines on X-axis
      },
    },
  },
};

const labels = ["Option1", "Option2", "Option3", "Option4"];

const data = {
  labels,
  datasets: [
    {
      label: "",
      data: labels.map(() => Math.floor(Math.random() * 1000)),
      backgroundColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(0, 128, 0, 1)",
        "rgba(255, 0, 255, 1)",
      ],
    },
  ],
};
export default function PollBargraph() {
  return (
    <Box p="2rem">
      <Bar options={options} data={data} />
    </Box>
  );
}
