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

  // State to hold the current color mode
  const [colorMode, setColorMode] = useState("light");
  // State to hold room data
  const [roomData, setRoomData] = useState(null);

  // Chart reference to access the underlying Chart.js instance
  const chartRef = useRef();

  const token = localStorage.getItem("accessToken");

  // Retrieve color mode from local storage
  useEffect(() => {
    const storedColorMode = localStorage.getItem("chakra-ui-color-mode");
    if (storedColorMode) {
      setColorMode(storedColorMode);
    }
  }, []);

  // Fetch room data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/room/stats/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoomData(response.data.room_data); // Set roomData to response.data.room_data
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchData();
  }, []);

  // Define color schemes for light and dark modes
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

  // Set chart options based on the color mode
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

  // Function to set background color of the entire chart
  useEffect(() => {
    if (chartRef.current && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.options.plugins.background.color =
        colors[colorMode].background;
      chartRef.current.chartInstance.update();
    }
  }, [colorMode]);

  // Render loading indicator while fetching data
  if (!roomData) {
    return <div>Loading...</div>;
  }

  // Extract labels and data from roomData
  const recentRoomData = roomData.slice(-6).reverse();
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
