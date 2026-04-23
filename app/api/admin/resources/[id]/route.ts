import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "Admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    
    if (!status) return NextResponse.json({ message: "Bad Request" }, { status: 400 });

    const { id } = await params;

    const resource = await db.resource.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(resource);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
