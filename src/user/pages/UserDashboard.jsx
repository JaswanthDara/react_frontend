import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user && user.id) {
          try {
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
            console.error("Error fetching projects:", error);
          }
        } else {
          console.warn("User ID not found. Skipping project fetch.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-heading">Welcome, {user?.name || "User"}</h1>
        <p className="dashboard-subtitle">
          Here's an overview of your ongoing safety monitoring projects.
        </p>
      </header>

      <div className="dashboard-content">
        {/* User Projects */}
        <div className="dashboard-card">
          <h2 className="card-heading">Your Projects</h2>

          {projects.length > 0 ? (
            <ul className="project-list">
              {projects.map((project) => (
                <li className="project-item" key={project._id}>
                  <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-desc">
                      Risk Level:{" "}
                      <span
                        className={`risk-label ${(
                          project.riskLevel || "low"
                        ).toLowerCase()}`}
                      >
                        {project.riskLevel || "Low"}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-projects">No projects found for your account.</p>
          )}
        </div>

        {/* Recommendations */}
        <div className="dashboard-card">
          <h2 className="card-heading">Quick Recommendations</h2>
          <p className="recommendation-text">
            Submit your site or equipment projects to receive smart safety
            recommendations based on real-time analysis and past records.
          </p>
          <ul className="recommendation-list">
            <li>✔ Regularly inspect your safety gear.</li>
            <li>✔ Ensure all workers wear appropriate PPE.</li>
            <li>✔ Schedule safety audits every quarter.</li>
            <li>✔ Maintain detailed project risk logs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
