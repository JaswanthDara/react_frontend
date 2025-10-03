import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const GearLogView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gearLog, setGearLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGearLog = async () => {
      try {
        const data = await api.get(`/gearlogs/${id}`);
        setGearLog(data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load gear log.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchGearLog();
  }, [id]);

  if (loading) return <p className="loading">Loading gear log details...</p>;
  if (!gearLog) return <p className="no-data">Gear log not found.</p>;

  return (
    <div className="incident-view-container">
      <div className="incident-card">
       

        <h2>Gear Log Details</h2>

        <div className="row">
          <div className="field">
            <label>Equipment:</label>
            <p>{gearLog.equipment?.name || "—"}</p>
          </div>
          <div className="field">
            <label>Project:</label>
            <p>{gearLog.project?.name || "—"}</p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>User:</label>
            <p>{gearLog.user?.name || "—"}</p>
          </div>
          <div className="field">
            <label>Action:</label>
            <p>{gearLog.action}</p>
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Notes:</label>
            <p>{gearLog.notes || "—"}</p>
          </div>
          <div className="field">
            <label>Timestamp:</label>
            <p>{gearLog.timestamp ? new Date(gearLog.timestamp).toLocaleString() : "—"}</p>
          </div>
        </div>

        
         <button className="btn-back" onClick={() => navigate("/admin/gearlogs")}>
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default GearLogView;
