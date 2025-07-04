// ✅ Add at very top
import { Buffer } from "buffer";
if (!window.Buffer) {
  window.Buffer = Buffer;
}

// Now your React app
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
