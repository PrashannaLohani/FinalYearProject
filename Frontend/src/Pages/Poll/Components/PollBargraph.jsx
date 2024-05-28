import React, { useEffect, useState, useRef } from "react";
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
import axios from "axios";

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

export default function PollBargraph({ qid }) {
  const [pollData, setPollData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const ws = useRef(null);

  const fetchData = async (pollCode, qid) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/Poll/options/", {
        params: { poll_id: pollCode, qid: qid },
      });
      const { poll_options } = response.data;
      console.log("Fetched poll options:", poll_options);
      setPollData(poll_options || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching poll data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const pollCode = localStorage.getItem("Poll_Code");

    if (qid) {
      fetchData(pollCode, qid);
    }

    if (pollCode && qid) {
      const encodedQid = encodeURIComponent(qid);
      ws.current = new WebSocket(
        `ws://127.0.0.1:8000/ws/poll/${pollCode}/${encodedQid}/`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);
        if (message.qid === qid && message.action === "vote") {
          fetchData(pollCode, qid); // Fetch the updated poll data
        }
      };

      ws.current.onclose = (event) => {
        if (!event.wasClean) {
          console.log(
            "WebSocket connection closed unexpectedly. Reconnecting..."
          );
          setTimeout(() => {
            const newSocket = new WebSocket(
              `ws://127.0.0.1:8000/ws/poll/${pollCode}/${encodedQid}/`
            );
            newSocket.onopen = ws.current.onopen;
            newSocket.onmessage = ws.current.onmessage;
            newSocket.onclose = ws.current.onclose;
            newSocket.onerror = ws.current.onerror;
            ws.current = newSocket;
          }, 1000);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error observed:", error);
      };

      return () => {
        ws.current.close();
      };
    }
  }, [qid]);

  if (!pollData || pollData.length === 0) {
    return <div>No data available</div>;
  }

  const labels = pollData.map((option) => option.options);
  const data = pollData.map((option) => option.votes);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: data,
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
      <Bar options={options} data={chartData} />
    </Box>
  );
}
