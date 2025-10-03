import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard";
import ProjectCreate from "./pages/ProjectCreate";
import ProjectEdit from "./pages/ProjectEdit";
import ProjectView from "./pages/ProjectView";
import Projects from "./pages/Projects";
import RecommendationsPage from "./pages/Recommendations";

const UserRoutes = () => {
  return (
    <div>
     

      <Routes>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="projects" element={<Projects />} />
         <Route path="projects/create" element={<ProjectCreate />} />
      <Route path="projects/:id/edit" element={<ProjectEdit />} />
      <Route path="projects/:id" element={<ProjectView />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
      </Routes>
    </div>
  );
};

export default UserRoutes;
