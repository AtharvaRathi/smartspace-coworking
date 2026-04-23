import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { resourceId, date, startTime, endTime } = await req.json();

    if (!resourceId || !date || !startTime || !endTime) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Double-booking prevention logic using Prisma serializable transaction
    const booking = await db.$transaction(async (tx) => {
      // Check if the resource is currently under maintenance
      const resource = await tx.resource.findUnique({
        where: { id: resourceId }
      });
      
      if (!resource || resource.status === "Maintenance") {
        throw new Error("Resource is unavailable or under maintenance.");
      }

      // Check overlapping time slots on the same date for the resource
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          resourceId,
          date,
          status: "Confirmed",
          OR: [
            {
              startTime: { lt: endTime },
              endTime: { gt: startTime }
            }
          ]
        }
      });

      if (conflictingBooking) {
        throw new Error("Conflict! This desk was just claimed by another user.");
      }

      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          userId: (session.user as any).id,
          resourceId,
          date,
          startTime,
          endTime,
          status: "Confirmed"
        }
      });
      
      // Simulate transaction payment log
      await tx.transaction.create({
         data: {
             userId: (session.user as any).id,
             bookingId: newBooking.id,
             amount: resource.type === "Room" ? 50 : 15,
             status: "Completed"
         }
      });

      return newBooking;
    });

    return NextResponse.json({ message: "Booking confirmed", booking }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 409 }); // 409 Conflict
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  
  if (!date) {
    return NextResponse.json({ message: "Missing date parameter" }, { status: 400 });
  }

  const bookings = await db.booking.findMany({
    where: { date, status: "Confirmed" },
    include: { user: { select: { name: true } } }
  });

  return NextResponse.json(bookings);
}
