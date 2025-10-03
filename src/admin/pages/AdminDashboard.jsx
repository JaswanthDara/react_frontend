import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faProjectDiagram,
  faExclamationTriangle,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    projectCount: 0,
    incidentCount: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    })();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">
        Welcome to the <strong>Construction Site Safety Management System</strong>.
      </p>

      <section className="cards">
        <div className="card card-blue">
          <FontAwesomeIcon icon={faUsers} className="card-icon" />
          <h2>Users</h2>
          <p>Total registered users on the platform.</p>
          <p className="stat-value">{stats.userCount}</p>
          <Link to="/admin/users" className="btn">View</Link>
        </div>

        <div className="card card-green">
          <FontAwesomeIcon icon={faProjectDiagram} className="card-icon" />
          <h2>Projects</h2>
          <p>Manage all ongoing construction projects.</p>
          <p className="stat-value">{stats.projectCount}</p>
          <Link to="/admin/projects" className="btn">View</Link>
        </div>

        <div className="card card-red">
          <FontAwesomeIcon icon={faExclamationTriangle} className="card-icon" />
          <h2>Incidents</h2>
          <p>Track and manage reported site incidents.</p>
          <p className="stat-value">{stats.incidentCount}</p>
          <Link to="/admin/incidents" className="btn">View</Link>
        </div>

        <div className="card card-yellow">
          <FontAwesomeIcon icon={faCogs} className="card-icon" />
          <h2>Equipment</h2>
          <p>Monitor equipment status and availability.</p>
          <Link to="/admin/equipment" className="btn">View</Link>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
