import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import api from "../../services/api"; 

const GearLogManagement = () => {
  const [gearLogs, setGearLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Gear Logs
  useEffect(() => {
    const fetchGearLogs = async () => {
      try {
        const token = localStorage.getItem("ssm_token");
        if (!token) {
          Swal.fire("Error", "You are not authenticated.", "error");
          setLoading(false);
          return;
        }

        api.setToken(token);
        const data = await api.get("/gearlogs");
        setGearLogs(data || []);
      } catch (error) {
        console.error("Error fetching gear logs:", error.response?.data || error);
        Swal.fire(
          "Error",
          error.response?.data?.message || "Failed to load gear logs.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGearLogs();
  }, []);

  // Delete Gear Log
  const handleDelete = (logId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This gear log will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/gearlogs/${logId}`);
          setGearLogs((prev) => prev.filter((log) => log._id !== logId));
          Swal.fire("Deleted!", "Gear log has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting gear log:", error);
          Swal.fire("Error", "Failed to delete gear log.", "error");
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
          <i className="fa fa-cogs"></i> Gear Log Management
        </h2>
        <Link to="/admin/gearlogs/create" className="btn-create">
          <i className="fa fa-plus"></i> Add Gear Log
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <p className="loading">Loading gear logs...</p>
      ) : (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.N</th>
                <th>Equipment</th>
                <th>Project</th>
                <th>User</th>
                <th>Action</th>
                <th>Notes</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gearLogs.length > 0 ? (
                gearLogs.map((log, index) => (
                  <tr key={log._id}>
                    <td>{index + 1}</td>
                    <td>{log.equipment?.name || "—"}</td>
                    <td>{log.project?.name || "—"}</td>
                    <td>{log.user?.name || "—"}</td>

                 
                    <td>
                      <span
                        className={`action-badge ${
                          log.action === "Assigned"
                            ? "badge-assigned"
                            : log.action === "Returned"
                            ? "badge-returned"
                            : log.action === "Maintenance"
                            ? "badge-maintenance"
                            : "badge-inspection"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>{log.notes || "—"}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>

                    <td className="actions">
                      <Link
                        to={`/admin/gearlogs/${log._id}`}
                        className="btn-sm btn-view"
                      >
                        <i className="fa fa-eye"></i>View
                      </Link>
                      <Link
                        to={`/admin/gearlogs/${log._id}/edit`}
                        className="btn-sm btn-edit"
                      >
                        <i className="fa fa-edit"></i>Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(log._id)}
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
                    <i className="fa fa-info-circle"></i> No gear logs found.
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

export default GearLogManagement;
