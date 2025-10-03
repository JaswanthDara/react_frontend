import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const IncidentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) {
          Swal.fire("Error", "You are not authenticated.", "error");
          setLoading(false);
          return;
        }
        api.setToken(token);

        const data = await api.get(`/incidents/${id}`);
        setIncident(data);
      } catch (error) {
        console.error("Error fetching incident:", error.response?.data || error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to load incident data.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  if (loading) return <p className="loading">Loading incident details...</p>;
  if (!incident) return <p className="no-data">Incident not found.</p>;

  return (
    <div className="incident-view-container">
      <div className="incident-card">
        

        <h2>Incident Details</h2>

        <div className="row">
          <div className="field">
            <label>Title:</label>
            <p>{incident.title}</p>
          </div>
          <div className="field">
            <label>Project:</label>
            <p>{incident.project?.name || "—"}</p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Reported By:</label>
            <p>{incident.reportedBy?.name || "—"}</p>
          </div>
          <div className="field">
            <label>Severity:</label>
            <p>{incident.severity.toUpperCase()}</p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Status:</label>
            <p>{incident.status.toUpperCase()}</p>
          </div>
          <div className="field">
            <label>Reported At:</label>
            <p>{new Date(incident.reportedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="row">
          <div className="field full-width">
            <label>Description:</label>
            <p>{incident.description}</p>
          </div>
        </div>

        {incident.attachments && incident.attachments.length > 0 && (
          <div className="row">
            <div className="field full-width">
              <label>Attachments:</label>
              <ul>
                {incident.attachments.map((file, idx) => (
                  <li key={idx}>
                    <a href={file} target="_blank" rel="noopener noreferrer">
                      {file.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <button className="btn-back" onClick={() => navigate("/admin/incidents")}>
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default IncidentView;
