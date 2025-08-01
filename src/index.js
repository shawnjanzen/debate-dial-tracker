import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // global styles
import DebateDialApp from "./DebateDialApp";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DebateDialApp />
  </React.StrictMode>
);
