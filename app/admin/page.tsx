import { db } from "@/lib/db";
import InventoryTable from "@/components/admin/InventoryTable";
import OfficeManagement from "@/components/admin/OfficeManagement";
import { Users, DollarSign, Activity } from "lucide-react";

export default async function AdminPage() {
  const usersCount = await db.user.count({ where: { role: "Member" } });
  
  const today = new Date().toISOString().split("T")[0];
  const todaysBookings = await db.booking.count({ where: { date: today, status: "Confirmed" } });
  
  const totalResources = await db.resource.count();
  const occupancyRate = totalResources > 0 ? Math.round((todaysBookings / totalResources) * 100) : 0;

  const currentMonth = new Date();
  currentMonth.setDate(1); // very naive monthly range start
  const transactions = await db.transaction.findMany({
      where: {
          createdAt: { gte: currentMonth },
          status: "Completed"
      }
  });
  const monthlyRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const resources = await db.resource.findMany({ 
    include: { office: true },
    orderBy: { name: 'asc' } 
  });

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                 <Users className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-sm font-medium text-gray-500">Active Members</p>
                 <p className="text-2xl font-bold text-gray-900">{usersCount}</p>
              </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                 <Activity className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-sm font-medium text-gray-500">Today's Occupancy</p>
                 <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
              </div>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                 <DollarSign className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                 <p className="text-2xl font-bold text-gray-900">${monthlyRevenue.toFixed(2)}</p>
              </div>
           </div>
        </div>

        <OfficeManagement />

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Resource Inventory</h2>
        <InventoryTable initialResources={resources} />
      </main>
    </>
  );
}

