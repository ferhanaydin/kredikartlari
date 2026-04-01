import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { category: true }
    });
    return NextResponse.json(brands);
  } catch (error) {
    return NextResponse.json({ message: "Markalar yüklenemedi" }, { status: 500 });
  }
}
