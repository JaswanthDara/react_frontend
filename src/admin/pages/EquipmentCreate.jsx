import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const EquipmentCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [equipment, setEquipment] = useState({
    name: "",
    serialNumber: "",
    category: "PPE",
    status: "Available",
    lastInspectionDate: "",
    condition: "Good",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Calculate max selectable date
  const getMaxInspectionDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - 2);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (id) fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const data = await api.get(`/equipment/${id}`);
      setEquipment({
        name: data.name || "",
        serialNumber: data.serialNumber || "",
        category: data.category || "PPE",
        status: data.status || "Available",
        lastInspectionDate: data.lastInspectionDate
          ? new Date(data.lastInspectionDate).toISOString().split("T")[0]
          : "",
        condition: data.condition || "Good",
      });
    } catch (error) {
      console.error("Error fetching equipment:", error);
      Swal.fire("Error", "Failed to load equipment data.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipment((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!equipment.name) errs.name = "Name is required.";
    if (!equipment.serialNumber) errs.serialNumber = "Serial Number is required.";
    if (!equipment.category) errs.category = "Category is required.";
    if (!equipment.status) errs.status = "Status is required.";
    if (!equipment.condition) errs.condition = "Condition is required.";
    if (!equipment.lastInspectionDate)
      errs.lastInspectionDate = "Last Inspection Date is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (id) {
        await api.put(`/equipment/${id}`, equipment);
        Swal.fire("Success", "Equipment updated successfully.", "success");
      } else {
        await api.post("/equipment", equipment);
        Swal.fire("Success", "Equipment created successfully.", "success");
      }
      navigate("/admin/equipment");
    } catch (error) {
      console.error("Error saving equipment:", error.response || error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to save equipment.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="equipment-form-container">
      <h2>{id ? "Edit Equipment" : "Add Equipment"}</h2>
      <form onSubmit={handleSubmit} className="equipment-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={equipment.name}
              onChange={handleChange}
              placeholder="Equipment Name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              name="serialNumber"
              value={equipment.serialNumber}
              onChange={handleChange}
              placeholder="Serial Number"
            />
            {errors.serialNumber && (
              <span className="error">{errors.serialNumber}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={equipment.category}
              onChange={handleChange}
            >
              <option value="PPE">PPE</option>
              <option value="Machinery">Machinery</option>
              <option value="Tool">Tool</option>
            </select>
            {errors.category && <span className="error">{errors.category}</span>}
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={equipment.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            {errors.status && <span className="error">{errors.status}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Condition</label>
            <select
              name="condition"
              value={equipment.condition}
              onChange={handleChange}
            >
              <option value="Good">Good</option>
              <option value="Needs Repair">Needs Repair</option>
              <option value="Out of Service">Out of Service</option>
            </select>
            {errors.condition && <span className="error">{errors.condition}</span>}
          </div>
          <div className="form-group">
            <label>Last Inspection Date</label>
            <input
              type="date"
              name="lastInspectionDate"
              value={equipment.lastInspectionDate}
              onChange={handleChange}
              max={getMaxInspectionDate()}
            />
            {errors.lastInspectionDate && (
              <span className="error">{errors.lastInspectionDate}</span>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/equipment")}
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

export default EquipmentCreate;
