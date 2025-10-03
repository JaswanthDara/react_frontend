import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const ProjectCreate = () => {
  const navigate = useNavigate();

  const [project, setProject] = useState({
    name: "",
    user: "",
    location: "",
    startDate: "",
    endDate: "",
    environment: "construction",
    riskLevel: "medium",
    safetyRequirements: "",
    hazards: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await api.get("/users");
      setUsers(users || []);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!project.name) errs.name = "Project name is required.";
    if (!project.user) errs.user = "User is required.";
    if (!project.riskLevel) errs.riskLevel = "Risk level is required.";
    if (!project.environment) errs.environment = "Environment is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        ...project,
        safetyRequirements: project.safetyRequirements
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        hazards: project.hazards
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
      };

      await api.post("/projects", payload);
      Swal.fire("Success", "Project created successfully.", "success");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create project.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-form-container">
      <h2>Create Project</h2>
      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-row">
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              name="name"
              value={project.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>User</label>
            <select name="user" value={project.user} onChange={handleChange}>
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.user && <span className="error">{errors.user}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={project.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Environment</label>
            <select
              name="environment"
              value={project.environment}
              onChange={handleChange}
            >
              <option value="construction">Construction</option>
              <option value="factory">Factory</option>
              <option value="warehouse">Warehouse</option>
              <option value="outdoor">Outdoor</option>
            </select>
            {errors.environment && (
              <span className="error">{errors.environment}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Risk Level</label>
            <select
              name="riskLevel"
              value={project.riskLevel}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.riskLevel && (
              <span className="error">{errors.riskLevel}</span>
            )}
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={project.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={project.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Safety Requirements <small>(comma-separated)</small></label>
            <input
              type="text"
              name="safetyRequirements"
              value={project.safetyRequirements}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Hazards <small>(comma-separated)</small></label>
            <input
              type="text"
              name="hazards"
              value={project.hazards}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/projects")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreate;
