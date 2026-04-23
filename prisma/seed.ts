import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Default Users
  const passwordHash = await bcrypt.hash("password123", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@smartspace.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@smartspace.com",
      passwordHash,
      role: "Admin",
      tier: "Basic"
    }
  });

  await prisma.user.upsert({
    where: { email: "member@smartspace.com" },
    update: {},
    create: {
      name: "Member User",
      email: "member@smartspace.com",
      passwordHash,
      role: "Member",
      tier: "Gold"
    }
  });

  // Check if resources already seeded
  const count = await prisma.resource.count();
  if (count > 0) {
    console.log("Resources already seeded.");
    return;
  }

  const resources = [];
  
  // 20 Desks
  for (let i = 1; i <= 20; i++) {
    resources.push({
      type: "Desk",
      name: `Desk #${i}`,
      attributes: JSON.stringify({ hasMonitor: i % 2 === 0, nearWindow: i <= 5 }),
      status: "Available"
    });
  }

  // 5 Cabins
  for (let i = 1; i <= 5; i++) {
    resources.push({
      type: "Cabin",
      name: `Cabin #${i}`,
      attributes: JSON.stringify({ capacity: 4, hasProjector: false }),
      status: "Available"
    });
  }

  // 3 Meeting Rooms
  for (let i = 1; i <= 3; i++) {
    resources.push({
      type: "Room",
      name: `Meeting Room #${i}`,
      attributes: JSON.stringify({ capacity: 10, hasProjector: true, hasWhiteboard: true }),
      status: "Available"
    });
  }

  const creates = resources.map(res => prisma.resource.create({ data: res }));
  await Promise.all(creates);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
