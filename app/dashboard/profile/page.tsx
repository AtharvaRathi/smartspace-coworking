import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import BookingHistory from "@/components/profile/BookingHistory";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      bookings: {
        include: { resource: true },
        orderBy: { date: 'desc' }
      }
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const today = new Date().toISOString().split("T")[0];
  
  const upcomingBookings = user.bookings.filter(b => b.date >= today && b.status === "Confirmed");
  const pastBookings = user.bookings.filter(b => b.date < today || b.status !== "Confirmed");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{user.name}</h1>
          <p className="mt-2 text-lg text-slate-600">{user.email}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4">
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-100">
            {user.tier} Tier
          </div>
          <div className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium border border-gray-200">
            {user.role}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Upcoming Bookings</h2>
          <BookingHistory bookings={upcomingBookings} emptyMessage="No upcoming bookings." />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Past Bookings</h2>
          <BookingHistory bookings={pastBookings} emptyMessage="No past bookings." />
        </div>
      </div>
    </div>
  );
}
