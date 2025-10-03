import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import api from "../../services/api"; 

const HazardManagement = () => {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all hazards
  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) {
          Swal.fire("Error", "You are not authenticated.", "error");
          setLoading(false);
          return;
        }

        api.setToken(token);
        const data = await api.get("/hazards");
        setHazards(data || []);
      } catch (error) {
        console.error("Error fetching hazards:", error.response?.data || error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to load hazards.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHazards();
  }, []);

  // Delete hazard 
  const handleDelete = (hazardId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This hazard will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/hazards/${hazardId}`);
          setHazards((prev) => prev.filter((h) => h._id !== hazardId));
          Swal.fire("Deleted!", "Hazard has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting hazard:", error);
          Swal.fire("Error", "Failed to delete hazard.", "error");
        }
      }
    });
  };

  return (
    <div className="container user-management">
      {/* Page Header */}
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h2>
          <i className="fa fa-exclamation-circle"></i> Hazard Management
        </h2>
        <Link to="/admin/hazards/create" className="btn-create">
          <i className="fa fa-plus"></i> Add Hazard
        </Link>
      </div>

      {/* Hazards Table */}
      {loading ? (
        <p className="loading">Loading hazards...</p>
      ) : (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Title</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hazards.length > 0 ? (
                hazards.map((hazard, index) => (
                  <tr key={hazard._id}>
                    <td>{index + 1}</td>
                    <td>{hazard.title}</td>
                    <td>{hazard.description || "—"}</td>

                    {/* Severity Badge */}
                    <td>
                      <span
                        className={`severity-badge ${
                          hazard.severity === "High"
                            ? "severity-critical"
                            : hazard.severity === "Medium"
                            ? "severity-major"
                            : "severity-minor"
                        }`}
                      >
                        {hazard.severity}
                      </span>
                    </td>

                    {/* Risk Level Badge */}
                    <td>
                      <span
                        className={`risk-badge ${
                          hazard.riskLevel === "high"
                            ? "risk-high"
                            : hazard.riskLevel === "medium"
                            ? "risk-medium"
                            : "risk-low"
                        }`}
                      >
                        {hazard.riskLevel.toUpperCase()}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className={`status-badge ${
                          hazard.status === "Resolved"
                            ? "status-resolved"
                            : hazard.status === "In Progress"
                            ? "status-investigating"
                            : "status-open"
                        }`}
                      >
                        {hazard.status}
                      </span>
                    </td>

                    {/* Reported By */}
                    <td>{hazard.reportedBy?.name || "Admin"}</td>

                    {/* Action Buttons */}
                    <td className="actions">
                      <Link
                        to={`/admin/hazards/${hazard._id}`}
                        className="btn-sm btn-view"
                      >
                        <i className="fa fa-eye"></i>View
                      </Link>
                      <Link
                        to={`/admin/hazards/${hazard._id}/edit`}
                        className="btn-sm btn-edit"
                      >
                        <i className="fa fa-edit"></i>Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(hazard._id)}
                        className="btn-sm btn-delete"
                      >
                        <i className="fa fa-trash"></i>Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    <i className="fa fa-info-circle"></i> No hazards found.
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

export default HazardManagement;
