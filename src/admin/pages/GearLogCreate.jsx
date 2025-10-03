import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const GearLogCreate = () => {
  const navigate = useNavigate();
  const [gearLog, setGearLog] = useState({
    equipment: "",
    project: "",
    user: "",
    action: "Assigned",
    notes: "",
    timestamp: "",
  });
  const [equipmentList, setEquipmentList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) return;
        api.setToken(token);

        const eq = await api.get("/equipment");
        setEquipmentList(eq || []);

        const pr = await api.get("/projects");
        setProjectList(pr || []);

        const us = await api.get("/users");
        setUserList(us || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGearLog((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!gearLog.equipment) errs.equipment = "Equipment is required.";
    if (!gearLog.action) errs.action = "Action is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/gearlogs", gearLog);
      Swal.fire("Success", "Gear log created successfully.", "success");
      navigate("/admin/gearlogs");
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to create gear log.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-form-container">
      <h2>Add Gear Log</h2>
      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-row">
          <div className="form-group">
            <label>Equipment</label>
            <select name="equipment" value={gearLog.equipment} onChange={handleChange}>
              <option value="">Select Equipment</option>
              {equipmentList.map((eq) => (
                <option key={eq._id} value={eq._id}>{eq.name}</option>
              ))}
            </select>
            {errors.equipment && <span className="error">{errors.equipment}</span>}
          </div>
          <div className="form-group">
            <label>Project</label>
            <select name="project" value={gearLog.project} onChange={handleChange}>
              <option value="">Select Project</option>
              {projectList.map((pr) => (
                <option key={pr._id} value={pr._id}>{pr.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>User</label>
            <select name="user" value={gearLog.user} onChange={handleChange}>
              <option value="">Select User</option>
              {userList.map((us) => (
                <option key={us._id} value={us._id}>{us.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Action</label>
            <select name="action" value={gearLog.action} onChange={handleChange}>
              <option value="Assigned">Assigned</option>
              <option value="Returned">Returned</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Inspection">Inspection</option>
            </select>
            {errors.action && <span className="error">{errors.action}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              name="notes"
              value={gearLog.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/admin/gearlogs")}>
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

export default GearLogCreate;
