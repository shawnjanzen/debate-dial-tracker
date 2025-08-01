// DebateDialApp.jsx

/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */

import React, { useState } from "react";

const SLIDER_MIN = 0;
const SLIDER_MAX = 10;

const barHeight = 48; // px, very thick for projection
const barBg = "#eee";
const barFg = "#0050b3";
const barOutline = "#222";

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export default function DebateDialApp() {
  // State for each participant: { name: string, value: number }
  const [participants, setParticipants] = useState([]);
  const [inputName, setInputName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  // Add participant by name
  function handleAddParticipant(e) {
    e.preventDefault();
    const name = inputName.trim();
    if (!name) return;
    // Only unique names (optional)
    if (participants.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      alert("Name already added.");
      return;
    }
    setParticipants([
      ...participants,
      { name, value: 5 } // default slider value in the center
    ]);
    setInputName("");
  }

  // Update a participant's slider value
  function handleSliderChange(idx, val) {
    setParticipants((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, value: Number(val) } : p
      )
    );
  }

  // Control logic
  function handleStart() {
    setIsStarted(true);
    setIsStopped(false);
  }
  function handleStop() {
    setIsStopped(true);
  }
  function handleReset() {
    setParticipants([]);
    setIsStarted(false);
    setIsStopped(false);
    setInputName("");
  }

  // Aggregate: calculate the average slider value
  const avg =
    participants.length > 0
      ? participants.reduce((sum, p) => sum + (Number(p.value) || 0), 0) /
        participants.length
      : 5; // defaults to 5 in the middle if no data

  // Scale aggregate for bar: 0-10 scale
  const barPct = ((clamp(avg, SLIDER_MIN, SLIDER_MAX) - SLIDER_MIN) /
    (SLIDER_MAX - SLIDER_MIN)) * 100;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        fontFamily: "sans-serif",
        fontSize: 22,
        padding: 32
      }}
    >
      <h1 style={{ fontSize: 42, marginBottom: 0 }}>Debate Dial Tracker</h1>
      <p style={{ fontSize: 20, marginTop: 10 }}>
        Participants: <strong>{participants.length}</strong>
      </p>
      {/* Controls */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={handleStart}
          disabled={isStarted}
          style={{
            fontSize: 24,
            marginRight: 12,
            background: "#33C674",
            color: "white",
            padding: "10px 22px",
            border: "none",
            borderRadius: 8,
            cursor: isStarted ? "not-allowed" : "pointer",
          }}
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isStarted || isStopped}
          style={{
            fontSize: 24,
            marginRight: 12,
            background: "#F24732",
            color: "white",
            padding: "10px 22px",
            border: "none",
            borderRadius: 8,
            cursor: (!isStarted || isStopped) ? "not-allowed" : "pointer",
          }}
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          style={{
            fontSize: 24,
            background: "#e2bc13",
            color: "#222",
            padding: "10px 22px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Reset
        </button>
      </div>
      {/* Add Name */}
      {!isStarted && (
        <form onSubmit={handleAddParticipant} style={{ marginBottom: 30 }}>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Enter your name"
            style={{
              fontSize: 24,
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #bbb",
              marginRight: 16,
              width: 250,
              maxWidth: "90%"
            }}
            disabled={isStarted}
          />
          <button
            type="submit"
            disabled={isStarted || !inputName.trim()}
            style={{
              fontSize: 24,
              background: "#0050b3",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              cursor: isStarted ? "not-allowed" : "pointer"
            }}
          >
            Add
          </button>
        </form>
      )}
      {/* List participant sliders */}
      {participants.length > 0 && (
        <div
          style={{
            marginBottom: 36,
            background: "#fafafa",
            borderRadius: 8,
            padding: 18,
            border: "1px solid #eee"
          }}
        >
          {participants.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                fontSize: 24
              }}
            >
              <span
                style={{
                  minWidth: 120,
                  fontWeight: "bold",
                  fontSize: 26,
                }}
              >
                {p.name}
              </span>
              <input
                type="range"
                min={SLIDER_MIN}
                max={SLIDER_MAX}
                step={0.1}
                value={p.value}
                onChange={(e) => handleSliderChange(i, e.target.value)}
                disabled={!isStarted || isStopped}
                style={{
                  flex: 1,
                  margin: "0 18px",
                  height: 10,
                  accentColor: "#0050b3",
                }}
              />
              <span
                style={{
                  minWidth: 36,
                  textAlign: "center",
                  fontSize: 27,
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 600,
                }}
              >
                {Number(p.value).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      )}
      {/* The big AGGREGATE dial/bar */}
      <div style={{ margin: "44px 0 12px 0", width: "100%" }}>
        <div
          style={{
            position: "relative",
            height: barHeight,
            background: barBg,
            borderRadius: barHeight / 2,
            border: `3px solid ${barOutline}`,
            boxSizing: "border-box",
            width: "100%",
            boxShadow: "0 0 8px #aaa",
            marginBottom: 5,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${barPct}%`,
              maxWidth: "100%",
              minWidth: 0,
              background: barFg,
              borderRadius: barHeight / 2,
              transition: "width 0.5s cubic-bezier(.45,1.58,.5,1)",
              zIndex: 1,
            }}
          />
          {/* Optional: tick marks for min/max */}
          <div
            style={{
              position: "absolute",
              left: 18,
              top: barHeight + 0,
              color: "#888",
              fontSize: 21,
            }}
          >
            0 / Disagree
          </div>
          <div
            style={{
              position: "absolute",
              right: 18,
              top: barHeight + 0,
              color: "#888",
              fontSize: 21,
            }}
          >
            10 / Agree
          </div>
          {/* Aggregate Value */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              color: "#fff",
              fontWeight: 900,
              fontSize: 38,
              textShadow: "1px 1px 6px #222",
              letterSpacing: 1,
              zIndex: 2,
            }}
          >
            {participants.length > 0 ? avg.toFixed(1) : "--"}
          </div>
        </div>
      </div>
    </div>
  );
}
