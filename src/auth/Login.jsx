import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import authAPI from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (err) => {
    if (!err) return "Login failed. Please try again.";
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data) return JSON.stringify(err.response.data);
    return "Login failed. Please try again.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      // Call login API
      const data = await authAPI.login(email, password);

      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server.");
      }

      // Store token in localstorage
      login(data.token);

      //  Show success message
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome, ${data.user.name}`,
        confirmButtonText: "Continue",
      });

      // Redirect based on role
      if (data.user.role === "Admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container form-container">
      <h2 className="form-title">Login</h2>
      <p className="form-subtitle">Access your Site Safety Monitor account</p>

      <form className="form-card" onSubmit={handleLogin} noValidate>
        {/* Error display */}
        {error && (
          <div className="error" role="alert" style={{ marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            aria-required="true"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-required="true"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="form-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </main>
  );
};

export default Login;
