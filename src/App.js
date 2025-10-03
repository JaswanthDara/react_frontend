import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./admin/AdminRoutes";
import UserRoutes from "./user/UserRoutes";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute roles={["Admin"]}>
                  <AdminRoutes />
                </ProtectedRoute>
              }
            />

            {/* User routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute roles={["User", "Worker", "Admin"]}>
                  <UserRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
