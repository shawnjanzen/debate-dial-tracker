// DebateDialApp.jsx
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const getTimestamp = () => new Date().toLocaleTimeString();

const DebateDialApp = () => {
  const [value, setValue] = useState(50);
  const [dataPoints, setDataPoints] = useState([]);
  const [userActivity, setUserActivity] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setDataPoints((prev) => [
        ...prev,
        { time: getTimestamp(), value },
      ]);

      setUserActivity((prev) => {
        const id = localStorage.getItem("debateUserId");
        return { ...prev, [id]: true };
      });
    }, 3000); // record every 3 seconds

    return () => clearInterval(interval);
  }, [value]);

  useEffect(() => {
    if (!localStorage.getItem("debateUserId")) {
      localStorage.setItem("debateUserId", Math.random().toString(36).substr(2, 9));
    }
  }, []);

  const resetSession = () => {
    setDataPoints([]);
    setUserActivity({});
  };

  const chartData = {
    labels: dataPoints.map((d) => d.time),
    datasets: [
      {
        label: "Audience Sentiment (0 = Against, 100 = For)",
        data: dataPoints.map((d) => d.value),
        fill: false,
        borderColor: "#3b82f6",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Live Debate Dial Tracker</h1>
      <p className="mb-4">
        Move the slider to indicate your current support level. 0 = Strongly Against,
        100 = Strongly For.
      </p>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full mb-4"
      />
      <p className="mb-4">Your current position: <strong>{value}</strong></p>
      <div className="mb-4">
        <Line data={chartData} />
      </div>
      <button
        onClick={resetSession}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Reset Debate Session
      </button>
      <p className="mt-4 text-sm text-gray-500">
        Active participants: {Object.keys(userActivity).length}
      </p>
    </div>
  );
};

export default DebateDialApp;
