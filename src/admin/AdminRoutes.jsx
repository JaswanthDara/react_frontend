import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import EquipmentManagement from "./pages/EquipmentManagement";
import EquipmentCreate from "./pages/EquipmentCreate";
import EquipmentEdit from "./pages/EquipmentEdit";
import UserManagement from "./pages/UserManagement";
import ProjectManagement from "./pages/ProjectManagement";
import IncidentManagement from "./pages/IncidentManagement";
import IncidentCreate from "./pages/IncidentCreate";
import IncidentEdit from "./pages/IncidentEdit";
import IncidentView from "./pages/IncidentView";
import HazardManagement from "./pages/HazardManagement";
import HazardCreate from "./pages/HazardCreate";
import HazardEdit from "./pages/HazardEdit";
import HazardView from "./pages/HazardView";
import GearLogManagement from "./pages/GearLogManagement";
import GearLogCreate from "./pages/GearLogCreate";
import GearLogEdit from "./pages/GearLogEdit";
import GearLogView from "./pages/GearLogView";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="dashboard" element={<AdminDashboard />} />

      <Route path="equipment" element={<EquipmentManagement />} />
      <Route path="equipment/create" element={<EquipmentCreate />} />
      <Route path="equipment/:id/edit" element={<EquipmentEdit />} />

      <Route path="users" element={<UserManagement />} />

      <Route path="projects" element={<ProjectManagement />} />

      <Route path="incidents" element={<IncidentManagement />} />
      <Route path="incidents/create" element={<IncidentCreate />} />
      <Route path="incidents/:id/edit" element={<IncidentEdit />} />
      <Route path="incidents/:id" element={<IncidentView />} />

      <Route path="hazards" element={<HazardManagement />} />
      <Route path="hazards/create" element={<HazardCreate />} />
      <Route path="hazards/:id/edit" element={<HazardEdit />} />
      <Route path="hazards/:id" element={<HazardView />} />

      <Route path="gearlogs" element={<GearLogManagement />} />
      <Route path="gearlogs/create" element={<GearLogCreate />} />
      <Route path="gearlogs/:id/edit" element={<GearLogEdit />} />
      <Route path="gearlogs/:id" element={<GearLogView />} />
    </Routes>
  );
};

export default AdminRoutes;
