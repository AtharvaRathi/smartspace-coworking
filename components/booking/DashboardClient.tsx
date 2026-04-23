"use client";

import { useState } from "react";
import FloorMap from "./FloorMap";

export default function DashboardClient({ offices, resources }: { offices: any[], resources: any[] }) {
  // If there are offices, select the first one by default, else null
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(offices.length > 0 ? offices[0].id : null);

  const selectedOffice = offices.find(o => o.id === selectedOfficeId);
  const filteredResources = selectedOfficeId ? resources.filter(r => r.officeId === selectedOfficeId) : resources;

  return (
    <div className="space-y-6">
      {offices.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Office Location</h3>
          <select 
            value={selectedOfficeId || ""}
            onChange={(e) => setSelectedOfficeId(e.target.value)}
            className="w-full md:w-1/3 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            {offices.map(office => (
              <option key={office.id} value={office.id}>{office.name} {office.location ? `(${office.location})` : ""}</option>
            ))}
          </select>
        </div>
      )}

      {selectedOffice ? (
        <FloorMap initialResources={filteredResources} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          No offices available to display.
        </div>
      )}
    </div>
  );
}
