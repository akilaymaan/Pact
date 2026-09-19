import { StrictMode } from "react";
import { MotionConfig } from "framer-motion";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/base.css";
import "./styles/nav-hero.css";
import "./styles/how.css";
import "./styles/sections.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
);
