import React from "react";

const EquipmentCard = ({ equipment }) => (
  <div className="bg-white rounded p-3 shadow">
    <div className="font-semibold">{equipment.name}</div>
    <div className="text-sm text-gray-600">{equipment.category} • {equipment.status}</div>
    <div className="text-xs text-gray-500 mt-2">{equipment.features?.join(", ")}</div>
  </div>
);

export default EquipmentCard;
