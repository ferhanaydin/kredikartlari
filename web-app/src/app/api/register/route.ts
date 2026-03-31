import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

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

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // İlk kayıt olan kişiye ADMIN rolü verilmez, default: USER'dir.
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
