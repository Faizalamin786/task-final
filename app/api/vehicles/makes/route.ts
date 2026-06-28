import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));

  const makes = await prisma.vehicle.findMany({
    where: { year },
    distinct: ["make"],
    select: { make: true },
    orderBy: { make: "asc" },
  });

  return NextResponse.json(makes.map((v) => v.make));
}