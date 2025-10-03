import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";


const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  //  Wait for auth initialization
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading authentication...
      </div>
    );
  }

  //  If not logged
  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Unauthorized Access",
      text: "You must be logged in to access this page.",
      confirmButtonText: "Go to Login",
      confirmButtonColor: "#3085d6",
    });
    console.warn("Unauthorized access — redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  //  If role not allowed
  if (roles.length > 0 && !roles.includes(user.role)) {
    Swal.fire({
      icon: "error",
      title: "Access Denied",
      text: `Your role (${user.role}) is not authorized to access this section.`,
      confirmButtonText: "OK",
      confirmButtonColor: "#d33",
    });
    console.warn(` Access denied for role "${user.role}"`);
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-50 text-gray-800 border border-yellow-200 rounded-md p-6">
        Access Denied — You don’t have permission to view this page.
      </div>
    );
  }

  //  Authorized 
  return children;
};

export default ProtectedRoute;
