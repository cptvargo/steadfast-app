import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

document.documentElement.setAttribute("data-theme", "neutral");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
