// DebateDialApp.jsx

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect, useRef } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const App = () => {
  const [value, setValue] = useState(0);
  const timerRef = useRef(null);

  const data = [
    {
      name: "Dial",
      value: value,
      fill: "#8884d8",
    },
  ];

  const handleStart = () => {
    if (timerRef.current) return; // prevent multiple timers
    timerRef.current = setInterval(() => {
      setValue((prev) => {
        if (prev >= 10) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 10;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleReset = () => {
    handleStop();
    setValue(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Debate Dial (0–10)</h2>
      <RadialBarChart
        width={400}
        height={400}
        cx="50%"
        cy="50%"
        innerRadius="30%"
        outerRadius="100%"
        barSize={150}  // Thick line for visibility
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 10]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          clockWise
          dataKey="value"
          cornerRadius={10}
        />
      </RadialBarChart>
      <p style={{ fontSize: "2rem" }}>Current Value: {value}</p>
      <div style={{ marginTop: "1.5rem" }}>
        <button onClick={handleStart} style={{ marginRight: "1rem" }}>
          Start
        </button>
        <button onClick={handleStop} style={{ marginRight: "1rem" }}>
          Stop
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default App;
