import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./router.jsx";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
