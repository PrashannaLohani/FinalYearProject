import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { w3cwebsocket as W3CWebSocket } from "websocket"; // Import WebSocket library

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

export default function RoomPollBargraph({ question }) {
  const [pollData, setPollData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const pollCode = localStorage.getItem("Roomtoken");
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/room/options/",
          {
            params: {
              question: question,
              poll_id: pollCode,
            },
          }
        );
        setPollData(response.data.poll_options);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchData();
    const pollCode = localStorage.getItem("Roomtoken");
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/poll/${pollCode}/`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.question === question || message.question === "all") {
        setPollData(message.options);
      }
    };

    socket.onclose = (event) => {
      if (!event.wasClean) {
        // Reconnect logic can be added here if needed
      }
    };

    socket.onerror = (error) => {};

    return () => {
      socket.close();
    };
  }, [question]);

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
