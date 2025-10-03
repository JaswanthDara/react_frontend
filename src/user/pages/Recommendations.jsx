import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const RecommendationsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user's projects
  useEffect(() => {
    (async () => {
      try {
        // Fetch all projects
        const data = await api.get(`/projects?user=${user.id}`);

        // Filter projects
        const userProjects = data.filter(
          (project) => project.user && project.user._id === user.id
        );
setProjects(userProjects);
        if (userProjects.length > 0) {
          setSelected(userProjects[0]._id);
        }
        // Set filtered projects
        setProjects(userProjects);
       
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    })();
  }, [user]);

  // Fetch equipments 
  useEffect(() => {
    if (!selected) {
      setEquipments([]);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const res = await api.get(`/equipment?projectId=${selected}`);
        const eqList = res.data || res;
        setEquipments(eqList);
      } catch (error) {
        console.error("Error fetching equipments:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [selected]);

  const getImageSrc = (serialNumber) => {
    if (!serialNumber) return "/equipments/default.png";
    return `/equipments/${serialNumber}.jpg`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Recommendations</h2>

      {/* Project Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium mr-2">Select Project:</label>
        <select
          value={selected || ""}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Equipments Grid or Details */}
      {loading ? (
        <p>Loading equipments...</p>
      ) : equipments.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {equipments.map((eq) => (
            <div
              key={eq._id}
              className="border rounded shadow p-4 flex flex-col items-center bg-white"
            >
              {/* Equipment Image */}
              <div className="w-32 h-32 overflow-hidden rounded mb-3">
                <img
                  src={getImageSrc(eq.serialNumber)}
                  alt={eq.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/equipments/default.png";
                  }}
                />
              </div>

              {/* Equipment Info */}
              <h3 className="font-semibold text-lg mb-1 text-center">
                {eq.name || "—"}
              </h3>
              <p className="text-sm text-gray-600 mb-1 text-center">
                Serial: {eq.serialNumber || "—"}
              </p>
              <p className="text-sm text-gray-600 mb-1 text-center">
                Category: {eq.category || "—"}
              </p>
              <p className="text-sm text-gray-600 mb-1 text-center">
                Status: {eq.status || "—"}
              </p>
              <p className="text-sm text-gray-600 mb-1 text-center">
                Condition: {eq.condition || "—"}
              </p>
              <p className="text-sm text-gray-600 text-center">
                Last Inspection: {formatDate(eq.lastInspectionDate)}
              </p>
            </div>
          ))}
        </div>
      ) : selected ? (
        <p className="text-gray-500">No equipments found for this project.</p>
      ) : (
        <p className="text-gray-500">Choose a project to see recommendations.</p>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default RecommendationsPage;
