import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Atau ambil dari Context/Zustand
  const location = useLocation();

  // Jika tidak ada token, redirect ke login
  // state={{ from: location }} berguna agar setelah login, user dikembalikan ke halaman yang tadi mau diakses
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika ada token, render halaman anak (Outlet)
  return <Outlet />;
};

export default PrivateRoute;
