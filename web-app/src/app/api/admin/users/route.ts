import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    // @ts-ignore
    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const { userId, action } = await req.json();

    if (!userId || !action) {
      return NextResponse.json({ message: "Eksik parametre." }, { status: 400 });
    }

    if (action === "approve") {
      await prisma.user.update({
        where: { id: userId },
        data: { isApproved: true }
      });
      return NextResponse.json({ message: "Kullanıcı onaylandı." });
    } 
    
    if (action === "reject") {
      // Reddetme durumunda kullanıcıyı silebiliriz veya rolünü USER'a düşürebiliriz. 
      // Kullanıcının isteği doğrultusunda siliyoruz.
      await prisma.user.delete({
        where: { id: userId }
      });
      return NextResponse.json({ message: "Kullanıcı başvurusu reddedildi ve silindi." });
    }

    return NextResponse.json({ message: "Geçersiz işlem." }, { status: 400 });

  } catch (error) {
    console.error("Kullanıcı yönetim hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası." }, { status: 500 });
  }
}
