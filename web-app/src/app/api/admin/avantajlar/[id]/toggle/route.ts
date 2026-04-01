import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  // @ts-ignore
  if (!session?.user || session.user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const av = await prisma.avantaj.findUnique({ where: { id }, select: { isActive: true } });
  if (!av) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.avantaj.update({ where: { id }, data: { isActive: !av.isActive } });
  return NextResponse.json({ isActive: updated.isActive });
}
