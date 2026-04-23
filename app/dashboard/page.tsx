import { db } from "@/lib/db";
import DashboardClient from "@/components/booking/DashboardClient";

export default async function DashboardPage() {
  // Fetch initial resources and offices server-side.
  const offices = await db.office.findMany({
    orderBy: { name: 'asc' }
  });
  const resources = await db.resource.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Workspace Map</h1>
        <p className="mt-2 text-lg text-slate-600">Check availability in real-time and secure your spot.</p>
      </div>
      <DashboardClient offices={offices} resources={resources} />
    </main>
  );
}
