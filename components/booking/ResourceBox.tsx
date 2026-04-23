"use client";

import { Monitor, Square, Users, Calendar } from "lucide-react";

export default function ResourceBox({ resource, isBooked, onClick }: any) {
  const isMaintenance = resource.status === "Maintenance";
  const isAvailable = !isBooked && !isMaintenance;

  let bgColorClass = "bg-green-100 border-green-400 hover:bg-green-200 cursor-pointer";
  if (isMaintenance) bgColorClass = "bg-gray-200 border-gray-400 opacity-50 cursor-not-allowed";
  else if (isBooked) bgColorClass = "bg-red-100 border-red-400 opacity-80 cursor-not-allowed";

  const renderIcon = () => {
    switch (resource.type) {
      case "Desk": return <Monitor className="w-6 h-6 mb-1 text-gray-600" />;
      case "Cabin": return <Square className="w-6 h-6 mb-1 text-gray-600" />;
      case "Room": return <Users className="w-6 h-6 mb-1 text-gray-600" />;
      default: return <Calendar className="w-6 h-6 mb-1 text-gray-600" />;
    }
  };

  return (
    <div 
      onClick={() => isAvailable && onClick(resource)}
      className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${bgColorClass} min-h-[100px] shadow-sm`}
    >
      {renderIcon()}
      <span className="font-semibold text-sm text-gray-800 text-center">{resource.name}</span>
      <span className="text-xs text-gray-500 mt-1 font-medium select-none">
        {isMaintenance ? "Maintenance" : (isBooked ? "Occupied" : "Available")}
      </span>
    </div>
  );
}
