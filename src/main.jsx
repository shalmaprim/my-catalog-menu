// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Ini Halaman Katalog kita
import "./index.css";

// 1. Import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 2. Buat halaman baru (kita akan buat filenya nanti)
import LoginPage from "./pages/LoginPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // Komponen pelindung

// 3. Definisikan rute/halaman
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Halaman katalog (yang sudah kita buat)
  },
  {
    path: "/login",
    element: <LoginPage />, // Halaman untuk admin login
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        {" "}
        {/* <-- Dibungkus pelindung */}
        <AdminPage /> {/* <-- Halaman admin rahasia */}
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 4. Gunakan RouterProvider */}
    <RouterProvider router={router} />
  </React.StrictMode>
);
