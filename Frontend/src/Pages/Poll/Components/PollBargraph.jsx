import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

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
      display: false,
    },
    label: {
      color: "white",
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

export default function PollBargraph() {
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pollCode = localStorage.getItem("Poll_Code");
        const question = localStorage.getItem("question");
        const response = await axios.get(
          "http://127.0.0.1:8000/Poll/options/",
          {
            params: {
              poll_id: pollCode,
              question: question,
            },
          }
        );
        setPollData(response.data.poll_options);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchData();
  }, []);

  if (!pollData) {
    return <div>Loading...</div>;
  }

  const labels = pollData.map((option) => option.options);
  const votes = pollData.map((option) => option.votes);

  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: votes,
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
  return (
    <Box p="2rem">
      <Bar options={options} data={data} />
    </Box>
  );
}
