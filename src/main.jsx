import App from "@/App.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";
import { ThemeProvider } from "@/provider/ThemeProvider.jsx";
import axios from "axios";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/index.css";

axios.defaults.baseURL = "http://34.70.170.117:80";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider storageKey="theme">
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
