import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ action: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Giriş yapmanız gerekmekte." }, { status: 401 });
    }

    const { campaignId, text } = await req.json();
    const user = await prisma.user.findUnique({ where: { email: session.user.email as string } });

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const resolvedParams = await params;

    if (resolvedParams.action === "favorite") {
      const existing = await prisma.favorite.findUnique({
        where: { userId_campaignId: { userId: user.id, campaignId } }
      });

      if (existing) {
        // Toggle (Çıkar)
        await prisma.favorite.delete({ where: { id: existing.id } });
        return NextResponse.json({ message: "Favorilerden çıkarıldı.", action: "removed" });
      } else {
        // Ekle
        await prisma.favorite.create({ data: { userId: user.id, campaignId } });
        return NextResponse.json({ message: "Favorilere eklendi.", action: "added" });
      }
    } else if (resolvedParams.action === "comment") {
      if (!text || text.trim() === "") {
        return NextResponse.json({ message: "Yorum boş olamaz." }, { status: 400 });
      }

      await prisma.comment.create({
        data: { text, userId: user.id, campaignId }
      });

      return NextResponse.json({ message: "Yorum eklendi." });
    }

    return NextResponse.json({ message: "Geçersiz işlem." }, { status: 400 });
  } catch (error) {
    console.error("Etkileşim API hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
