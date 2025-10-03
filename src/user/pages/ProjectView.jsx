import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (err) {
        console.error("Failed to fetch project:", err);
        Swal.fire("Error", "Failed to load project details.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return <p className="loading">Loading project details...</p>;
  }

  if (!project) {
    return <p className="no-data">Project not found.</p>;
  }

  return (
    <div className="incident-view-container">
      <div className="incident-card">
        <h2>Project Details</h2>

        <div className="row">
          <div className="field">
            <label>Project Name:</label>
            <p>{project.name || "—"}</p>
          </div>
          <div className="field">
            <label>User:</label>
            <p>{project.user?.name || "—"}</p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Location:</label>
            <p>{project.location || "—"}</p>
          </div>
          <div className="field">
            <label>Environment:</label>
            <p>{project.environment || "—"}</p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Risk Level:</label>
            <p>{project.riskLevel?.toUpperCase() || "—"}</p>
          </div>
          <div className="field">
            <label>Status:</label>
            <p>
              {project.endDate && new Date(project.endDate) < new Date()
                ? "Completed"
                : "Ongoing"}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Start Date:</label>
            <p>
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
          <div className="field">
            <label>End Date:</label>
            <p>
              {project.endDate
                ? new Date(project.endDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Safety Requirements:</label>
            <p>
              {project.safetyRequirements?.length > 0
                ? project.safetyRequirements.join(", ")
                : "—"}
            </p>
          </div>
          <div className="field">
            <label>Hazards:</label>
            <p>
              {project.hazards?.length > 0
                ? project.hazards.join(", ")
                : "—"}
            </p>
          </div>
        </div>

        <button
          className="btn-back"
          onClick={() => navigate("/projects")}
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default ProjectView;
