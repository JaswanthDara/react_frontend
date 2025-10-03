import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const HazardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hazard, setHazard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHazard = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) return;
        api.setToken(token);
        const data = await api.get(`/hazards/${id}`);
        setHazard(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load hazard data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchHazard();
  }, [id]);

  if (loading) return <p className="loading">Loading hazard details...</p>;
  if (!hazard) return <p className="no-data">Hazard not found.</p>;

  return (
    <div className="incident-view-container">
      <div className="incident-card">
        

        <h2>Hazard Details</h2>

        <div className="row">
          <div className="field">
            <label>Title:</label>
            <p>{hazard.title}</p>
          </div>
          <div className="field">
            <label>Severity:</label>
            <p>{hazard.severity}</p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Risk Level:</label>
            <p>{hazard.riskLevel}</p>
          </div>
          <div className="field">
            <label>Status:</label>
            <p>{hazard.status}</p>
          </div>
        </div>

        <div className="row">
          <div className="field full-width">
            <label>Description:</label>
            <p>{hazard.description || "—"}</p>
          </div>
        </div>

        {hazard.relatedEquipment && hazard.relatedEquipment.length > 0 && (
          <div className="row">
            <div className="field full-width">
              <label>Related Equipment:</label>
              <ul>
                {hazard.relatedEquipment.map((eq, idx) => (
                  <li key={idx}>{eq.name || eq}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <button className="btn-back" onClick={() => navigate("/admin/hazards")}>
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default HazardView;
