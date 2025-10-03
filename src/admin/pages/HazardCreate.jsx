import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const HazardCreate = () => {
  const navigate = useNavigate();
  const [hazard, setHazard] = useState({
    title: "",
    description: "",
    severity: "Low",
    riskLevel: "low",
    relatedEquipment: [],
    status: "Open",
  });
  const [equipmentList, setEquipmentList] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) return;
        api.setToken(token);
        const data = await api.get("/equipment");
        setEquipmentList(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEquipment();
  }, []);

  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name === "relatedEquipment") {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setHazard((prev) => ({ ...prev, [name]: selected }));
    } else {
      setHazard((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!hazard.title) errs.title = "Title is required.";
    if (!hazard.severity) errs.severity = "Severity is required.";
    if (!hazard.riskLevel) errs.riskLevel = "Risk Level is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/hazards", hazard);
      Swal.fire("Success", "Hazard created successfully.", "success");
      navigate("/admin/hazards");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create hazard.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-form-container">
      <h2>Add Hazard</h2>
      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={hazard.title}
              onChange={handleChange}
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
          <div className="form-group">
            <label>Severity</label>
            <select name="severity" value={hazard.severity} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.severity && <span className="error">{errors.severity}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Risk Level</label>
            <select name="riskLevel" value={hazard.riskLevel} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.riskLevel && <span className="error">{errors.riskLevel}</span>}
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={hazard.status} onChange={handleChange}>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={hazard.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Related Equipment</label>
            <select
              name="relatedEquipment"
              multiple
              value={hazard.relatedEquipment}
              onChange={handleChange}
            >
              {equipmentList.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/hazards")}
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

export default HazardCreate;
