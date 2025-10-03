import React from "react";

const EquipmentCard = ({ equipment }) => {
  if (!equipment) return null;

  const { name, category = "N/A", status = "Unknown", features = [] } = equipment;

  return (
    <div className="bg-white rounded p-3 shadow hover:shadow-md transition-shadow duration-200">
      <div className="font-semibold text-lg">{name}</div>
      <div className="text-sm text-gray-600">
        {category} • {status}
      </div>
      {features.length > 0 && (
        <div className="text-xs text-gray-500 mt-2">
          Features: {features.join(", ")}
        </div>
      )}
    </div>
  );
};

export default EquipmentCard;
