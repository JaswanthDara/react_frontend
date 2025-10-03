import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const IncidentCreate = () => {
  const navigate = useNavigate();
  const [incident, setIncident] = useState({
    title: "",
    project: "",
    reportedBy: "",
    description: "",
    severity: "minor",
    status: "open",
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.get("/projects");
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.get("/users");
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncident((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!incident.title) errs.title = "Title is required.";
    if (!incident.project) errs.project = "Project is required.";
    if (!incident.reportedBy) errs.reportedBy = "Reported By is required.";
    if (!incident.description) errs.description = "Description is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/incidents", incident);
      Swal.fire("Success", "Incident created successfully.", "success");
      navigate("/admin/incidents");
    } catch (error) {
      console.error("Error creating incident:", error.response || error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create incident.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-form-container">
      <h2>Add Incident</h2>
      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={incident.title}
              onChange={handleChange}
              placeholder="Incident Title"
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label>Project</label>
            <select
              name="project"
              value={incident.project}
              onChange={handleChange}
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
            {errors.project && <span className="error">{errors.project}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Reported By</label>
            <select
              name="reportedBy"
              value={incident.reportedBy}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
            {errors.reportedBy && <span className="error">{errors.reportedBy}</span>}
          </div>
          <div className="form-group">
            <label>Severity</label>
            <select
              name="severity"
              value={incident.severity}
              onChange={handleChange}
            >
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={incident.status}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={incident.description}
              onChange={handleChange}
              placeholder="Incident Description"
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/incidents")}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentCreate;
