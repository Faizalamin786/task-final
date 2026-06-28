import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const year = Number(req.nextUrl.searchParams.get("year"));
  const make = req.nextUrl.searchParams.get("make") || "";

  const models = await prisma.vehicle.findMany({
    where: { year, make },
    distinct: ["model"],
    select: { model: true },
    orderBy: { model: "asc" },
  });

  return NextResponse.json(models.map((v) => v.model));
}