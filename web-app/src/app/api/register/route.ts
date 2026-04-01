import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password, role, brandId } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Bu e-posta adresiyle kayıtlı bir hesap zaten var." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Firma editörü ise onay false, diğerleri true (ki giriş yapabilsinler)
    const isApproved = role === "FIRMA_EDITOR" ? false : true;

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
        // @ts-ignore
        brandId: brandId || null,
        isApproved
      },
    });

    return NextResponse.json(
      { message: "Başarıyla kayıt olundu", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json(
      { message: "Kayıt olurken sunucu tarafında bir hata oluştu." },
      { status: 500 }
    );
  }
}
