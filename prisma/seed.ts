import { PrismaClient } from "@prisma/client";
import vehicles from "./vehicles.json";

const prisma = new PrismaClient();

// seed data was generated using Claude AI with this prompt:
// "Give me a realistic JSON list of US vehicles from 2011-2024,
//  covering 15-20 common makes with several models per make per year"
// raw data is in prisma/vehicles.json

async function main() {
  console.log(`Seeding ${vehicles.length} vehicles...`);

  await prisma.vehicle.createMany({
    data: vehicles,
    skipDuplicates: true,
  });

  console.log("Done! Vehicle seed data inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });