import { Calendar, Clock, MapPin } from "lucide-react";

type Booking = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  resource: {
    name: string;
    type: string;
  };
};

export default function BookingHistory({ bookings, emptyMessage }: { bookings: Booking[], emptyMessage: string }) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.status === 'Confirmed' ? 'bg-green-500' : 'bg-red-400'}`}></div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                {booking.resource.name}
                <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {booking.resource.type}
                </span>
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {booking.date}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {booking.startTime} - {booking.endTime}
                </div>
              </div>
            </div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
