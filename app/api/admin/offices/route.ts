import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { name, location, numDesks, numCabins, numRooms } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Office name is required" }, { status: 400 });
    }

    const result = await db.$transaction(async (tx) => {
      const office = await tx.office.create({
        data: { name, location }
      });

      // Generate Desks
      for (let i = 1; i <= (numDesks || 0); i++) {
        await tx.resource.create({
          data: {
            type: "Desk",
            name: `Desk ${i}`,
            attributes: JSON.stringify({ features: ["Power", "Wifi"] }),
            officeId: office.id,
          }
        });
      }

      // Generate Cabins
      for (let i = 1; i <= (numCabins || 0); i++) {
        await tx.resource.create({
          data: {
            type: "Cabin",
            name: `Cabin ${i}`,
            attributes: JSON.stringify({ capacity: 4, features: ["Whiteboard", "Screen"] }),
            officeId: office.id,
          }
        });
      }

      // Generate Rooms
      for (let i = 1; i <= (numRooms || 0); i++) {
        await tx.resource.create({
          data: {
            type: "Room",
            name: `Meeting Room ${i}`,
            attributes: JSON.stringify({ capacity: 10, features: ["Projector", "Video Conferencing"] }),
            officeId: office.id,
          }
        });
      }

      return office;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
