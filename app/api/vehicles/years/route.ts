import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const years = await prisma.vehicle.findMany({
    distinct: ["year"],
    select: { year: true },
    orderBy: { year: "desc" },
  });

  return NextResponse.json(years.map((v) => v.year));
}