"use client";

import { useState, useEffect } from "react";
import ResourceBox from "./ResourceBox";
import toast from "react-hot-toast";

export default function FloorMap({ initialResources }: { initialResources: any[] }) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedResource, setSelectedResource] = useState<any | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [date, startTime, endTime]);

  // Is a resource currently booked in the selected timeframe?
  // Our fetched bookings are for the selected date. We need to check time overlap.
  const isResourceBooked = (resourceId: string) => {
    return bookings.some(b => {
      if (b.resourceId !== resourceId) return false;
      return (b.startTime < endTime && b.endTime > startTime);
    });
  };

  const handleBook = async () => {
    if (!selectedResource) return;
    setIsBooking(true);
    
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: selectedResource.id,
          date,
          startTime,
          endTime
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to book");

      toast.success("Successfully booked!");
      setSelectedResource(null);
      fetchBookings(); // Refresh bookings state
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date & Time Picker */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Select Date & Time</h3>
        <div className="flex flex-wrap gap-6 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm px-3 py-2 border"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
           <div className="h-32 bg-gray-200 rounded-xl"></div>
           <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
             <h3 className="text-xl font-bold mb-4 text-gray-800">Desks</h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {initialResources.filter(r => r.type === "Desk").map(r => (
                  <ResourceBox key={r.id} resource={r} isBooked={isResourceBooked(r.id)} onClick={setSelectedResource}/>
                ))}
             </div>
          </div>
          <div>
             <h3 className="text-xl font-bold mb-4 text-gray-800">Cabins</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {initialResources.filter(r => r.type === "Cabin").map(r => (
                  <ResourceBox key={r.id} resource={r} isBooked={isResourceBooked(r.id)} onClick={setSelectedResource}/>
                ))}
             </div>
          </div>
          <div>
             <h3 className="text-xl font-bold mb-4 text-gray-800">Meeting Rooms</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                {initialResources.filter(r => r.type === "Room").map(r => (
                  <ResourceBox key={r.id} resource={r} isBooked={isResourceBooked(r.id)} onClick={setSelectedResource}/>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
             <h3 className="text-lg font-bold">Confirm Booking</h3>
             <p className="mt-2 text-gray-600">Are you sure you want to book <span className="font-semibold text-gray-900">{selectedResource.name}</span> for {date} from {startTime} to {endTime}?</p>
             <div className="mt-6 flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedResource(null)}
                  disabled={isBooking}
                  className="px-4 py-2 bg-gray-100 font-medium text-gray-700 rounded-lg hover:bg-gray-200"
                >Cancel</button>
                <button 
                  onClick={handleBook}
                  disabled={isBooking}
                  className="px-4 py-2 bg-blue-600 font-medium text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isBooking ? "Booking..." : "Confirm"}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
