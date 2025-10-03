import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Projects = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("ssm_token");

        if (!token) {
          Swal.fire("Error", "You are not authenticated.", "error");
          setLoading(false);
          navigate("/login");
          return;
        }

        api.setToken(token);

        // Fetch all projects
        const data = await api.get(`/projects?user=${user.id}`);

        // Filter projects
        const userProjects = data.filter(
          (project) => project.user && project.user._id === user.id
        );

        console.log(data, userProjects);

        // Set filtered projects
        setProjects(userProjects);
      } catch (error) {
        console.error("Error fetching projects:", error.response?.data || error);

        if (error.response?.status === 403) {
          Swal.fire("Session Expired", "Please login again.", "warning");
          logout();
          navigate("/login");
        } else {
          Swal.fire(
            "Error",
            error.response?.data?.message || "Failed to load project list.",
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [logout, navigate, user.id]);

  // Delete project
  const handleDelete = async (projectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/projects/${projectId}`);
          setProjects((prev) => prev.filter((p) => p._id !== projectId));
          Swal.fire("Deleted!", "Project has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting project:", error);

          if (error.response?.status === 403) {
            Swal.fire("Session Expired", "Please login again.", "warning");
            logout();
            navigate("/login");
          } else {
            Swal.fire("Error", "Failed to delete project.", "error");
          }
        }
      }
    });
  };

  if (loading) return <p className="loading">Loading projects...</p>;

  return (
    <div className="container user-management">
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>
          <i className="fa fa-user-diagram"></i> Project Management
        </h2>
        <Link to="/projects/create" className="btn-create">
          <i className="fa fa-plus"></i> Add Project
        </Link>
      </div>

      {/* Project Table */}
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>S.N</th>
              <th>Project Name</th>
              <th>User</th>
              <th>Location</th>
              <th>Environment</th>
              <th>Risk Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.name}</td>
                  <td>{project.user?.name || "—"}</td>
                  <td>{project.location || "—"}</td>
                  <td>{project.environment}</td>
                  <td>
                    <span
                      className={`risk-badge ${
                        project.riskLevel === "high"
                          ? "risk-high"
                          : project.riskLevel === "medium"
                          ? "risk-medium"
                          : "risk-low"
                      }`}
                    >
                      {project.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {project.endDate &&
                    new Date(project.endDate) < new Date() ? (
                      <span className="status-badge status-inactive">
                        <i className="fa fa-times-circle"></i> Completed
                      </span>
                    ) : (
                      <span className="status-badge status-active">
                        <i className="fa fa-check-circle"></i> Ongoing
                      </span>
                    )}
                  </td>
                  <td className="actions">
                    <Link
                      to={`/projects/${project._id}`}
                      className="btn-sm btn-view"
                    >
                      <i className="fa fa-eye"></i> View
                    </Link>
                    <Link
                      to={`/projects/${project._id}/edit`}
                      className="btn-sm btn-edit"
                    >
                      <i className="fa fa-edit"></i> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id)}
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
                  <i className="fa fa-info-circle"></i> No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
