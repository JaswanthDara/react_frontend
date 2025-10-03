import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import api from "../../services/api"; 

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  //  Fetch all incidents 
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) {
          Swal.fire("Error", "You are not authenticated.", "error");
          setLoading(false);
          return;
        }
        api.setToken(token);

        const  data  = await api.get("/incidents"); 
        setIncidents(data || []);
      } catch (error) {
        console.error("Error fetching incidents:", error.response?.data || error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to load incidents.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  //  Delete incident 
  const handleDelete = (incidentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This incident will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/incidents/${incidentId}`);
          setIncidents((prev) => prev.filter((i) => i._id !== incidentId));
          Swal.fire("Deleted!", "Incident has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting incident:", error);
          Swal.fire("Error", "Failed to delete incident.", "error");
        }
      }
    });
  };

  return (
    <div className="container user-management">
      {/*  Page Header  */}
      <div
        className="page-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h2>
          <i className="fa fa-exclamation-triangle"></i> Incident Management
        </h2>
        <Link to="/admin/incidents/create" className="btn-create">
          <i className="fa fa-plus"></i> Add Incident
        </Link>
      </div>

      {/*  Incident Table  */}
      {loading ? (
        <p className="loading">Loading incidents...</p>
      ) : (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Title</th>
                <th>Project</th>
                <th>Reported By</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reported At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length > 0 ? (
                incidents.map((incident, index) => (
                  <tr key={incident._id}>
                    <td>{index + 1}</td>
                    <td>{incident.title}</td>
                    <td>{incident.project?.name || "—"}</td>
                    <td>{incident.reportedBy?.name || "—"}</td>
                    <td>
                      <span
                        className={`severity-badge ${
                          incident.severity === "critical"
                            ? "severity-critical"
                            : incident.severity === "major"
                            ? "severity-major"
                            : "severity-minor"
                        }`}
                      >
                        {incident.severity.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          incident.status === "resolved"
                            ? "status-resolved"
                            : incident.status === "investigating"
                            ? "status-investigating"
                            : "status-open"
                        }`}
                      >
                        {incident.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(incident.reportedAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <Link
                        to={`/admin/incidents/${incident._id}`}
                        className="btn-sm btn-view"
                      >
                        <i className="fa fa-eye"></i>View
                      </Link>
                      <Link
                        to={`/admin/incidents/${incident._id}/edit`}
                        className="btn-sm btn-edit"
                      >
                        <i className="fa fa-edit"></i>Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(incident._id)}
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
                    <i className="fa fa-info-circle"></i> No incidents found.
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

export default IncidentManagement;
