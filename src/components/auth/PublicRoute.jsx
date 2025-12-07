import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");

  // Jika user SUDAH login, jangan biarkan masuk ke halaman login/register
  // Lempar ke halaman utama/dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
