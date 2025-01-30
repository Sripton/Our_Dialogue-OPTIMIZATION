import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // Рендеринг приложения внутри <BrowserRouter>, который обеспечивает поддержку маршрутизации
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
