import React, { useEffect, useState, useRef } from "react";
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

  // Chart reference to access the underlying Chart.js instance
  const chartRef = useRef();

  // Retrieve color mode from local storage
  useEffect(() => {
    const storedColorMode = localStorage.getItem("chakra-ui-color-mode");
    if (storedColorMode) {
      setColorMode(storedColorMode);
    }
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

  const labels = ["Room1", "Room2", "Room3", "Room4", "Room5", "Room6"];

  const data = {
    labels,
    datasets: [
      {
        label: "Number of people joined",
        data: [20, 30, 40, 30, 20, 10, 25],
        backgroundColor: colors[colorMode].label,
      },
      {
        label: "Number of comments",
        data: [10, 15, 20, 12, 8, 10],
        backgroundColor: colors[colorMode].comment,
      },
    ],
  };

  return <Bar ref={chartRef} options={options} data={data} />;
};

export default BarGraph;
