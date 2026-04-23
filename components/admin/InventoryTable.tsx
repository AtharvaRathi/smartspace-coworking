"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function InventoryTable({ initialResources }: { initialResources: any[] }) {
  const [resources, setResources] = useState(initialResources);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Available" ? "Maintenance" : "Available";
    
    try {
      const res = await fetch(`/api/admin/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      setResources(resources.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast.success(`Resource marked as ${newStatus}`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {resources.map((r) => (
            <tr key={r.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.type}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.office?.name || "N/A"}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  onClick={() => toggleStatus(r.id, r.status)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  Toggle Maintenance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
