import React, { useEffect, useState, useRef } from "react";
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

  const [colorMode, setColorMode] = useState("light");
  const [roomData, setRoomData] = useState(null);
  const chartRef = useRef();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const storedColorMode = localStorage.getItem("chakra-ui-color-mode");
    if (storedColorMode) {
      setColorMode(storedColorMode);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/room/stats/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Response data:", response.data); // Log the entire response
        setRoomData(response.data.room_data);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchData();
  }, [token]);

  const colors = {
    light: {
      label: "rgba(0, 0, 0, 0.8)",
      comment: "rgba(128, 0, 0, 0.7)",
      background: "rgba(255, 255, 255, 1)",
    },
    dark: {
      label: "rgba(255, 255, 255, 0.8)",
      comment: "rgba(255, 99, 132, 0.7)",
      background: "rgba(0, 0, 0, 1)",
      grid: "rgba(255, 255, 255, 0.1)",
    },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: colors[colorMode].label,
        },
      },
      title: {
        display: true,
        text: "Engagement Level",
        color: colors[colorMode].label,
      },
    },
  };

  if (!roomData) {
    return <div>Loading...</div>;
  }

  // Use roomData as received from the backend
  const recentRoomData = roomData.slice(0, 6); // Taking only the first 6 entries if needed

  const labels = recentRoomData.map((room) => room.room_name);
  const numPeopleData = recentRoomData.map((room) => room.num_of_people);
  const numCommentsData = recentRoomData.map((room) => room.num_of_comments);

  const data = {
    labels,
    datasets: [
      {
        label: "Number of people joined",
        data: numPeopleData,
        backgroundColor: colors[colorMode].label,
      },
      {
        label: "Number of comments",
        data: numCommentsData,
        backgroundColor: colors[colorMode].comment,
      },
    ],
  };

  return <Bar ref={chartRef} options={options} data={data} />;
};

export default BarGraph;
