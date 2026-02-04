import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import Halaman
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";

// Import Komponen Pelindung
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Import CSS Global
import "./index.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
