import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Check if any office exists
  let mainOffice = await db.office.findFirst();

  if (!mainOffice) {
    mainOffice = await db.office.create({
      data: {
        name: "Main Office",
        location: "Headquarters",
      },
    });
    console.log("Created default Main Office");
  }

  // Find all resources without an office
  const unassignedResources = await db.resource.findMany({
    where: { officeId: null },
  });

  if (unassignedResources.length > 0) {
    const updated = await db.resource.updateMany({
      where: { officeId: null },
      data: { officeId: mainOffice.id },
    });
    console.log(`Assigned ${updated.count} resources to Main Office`);
  } else {
    console.log("All resources already assigned to an office.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
