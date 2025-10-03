import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import api from "../../services/api";

const EquipmentManagement = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all equipment 
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) {
          Swal.fire("Error", "You are not authenticated.", "error");
          setLoading(false);
          return;
        }
        api.setToken(token);

        const data = await api.get("/equipment");
        setEquipment(data || []);
      } catch (error) {
        console.error("Error fetching equipment:", error.response?.data || error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to load equipment list.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // Delete equipment
  const handleDelete = (equipmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This equipment will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/equipment/${equipmentId}`);
          setEquipment((prev) => prev.filter((eq) => eq._id !== equipmentId));
          Swal.fire("Deleted!", "Equipment has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting equipment:", error);
          Swal.fire("Error", "Failed to delete equipment.", "error");
        }
      }
    });
  };

  return (
    <div className="container user-management">
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h2>
          <i className="fa fa-hard-hat"></i> Equipment Management
        </h2>
        <Link to="/admin/equipment/create" className="btn-create">
          <i className="fa fa-plus"></i> Add Equipment
        </Link>
      </div>

      {loading ? (
        <p className="loading">Loading equipment...</p>
      ) : (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Name</th>
                <th>Serial Number</th>
                <th>Category</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Last Inspection</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.length > 0 ? (
                equipment.map((eq, index) => (
                  <tr key={eq._id}>
                    <td>{index + 1}</td>
                    <td>{eq.name}</td>
                    <td>{eq.serialNumber || "—"}</td>
                    <td>{eq.category}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          eq.status === "Available"
                            ? "status-available"
                            : eq.status === "In Use"
                            ? "status-inuse"
                            : "status-maintenance"
                        }`}
                      >
                        {eq.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`condition-badge ${
                          eq.condition === "Good"
                            ? "condition-good"
                            : eq.condition === "Needs Repair"
                            ? "condition-repair"
                            : "condition-outofservice"
                        }`}
                      >
                        {eq.condition}
                      </span>
                    </td>
                    <td>{eq.lastInspectionDate ? new Date(eq.lastInspectionDate).toLocaleDateString() : "—"}</td>
                    <td className="actions">
                     
                      <Link
                        to={`/admin/equipment/${eq._id}/edit`}
                        className="btn-sm btn-edit"
                      >
                        <i className="fa fa-edit"></i> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(eq._id)}
                        className="btn-sm btn-delete"
                      >
                        <i className="fa fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    <i className="fa fa-info-circle"></i> No equipment found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
