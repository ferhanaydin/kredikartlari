import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const bankId = formData.get("bankId") as string;
    const categoryId = formData.get("categoryId") as string;
    const endDateStr = formData.get("endDate") as string;
    const slug = formData.get("slug") as string;

    if (!title || !description || !bankId || !categoryId || !endDateStr || !slug) {
      return NextResponse.json({ message: "Eksik alanlar var." }, { status: 400 });
    }

    // @ts-ignore
    const isAdmin = session.user.role === "ADMIN";
    
    // Admin ekliyorsa direkt PUBLISHED, user ekliyorsa PENDING olacak.
    const status = isAdmin ? "PUBLISHED" : "PENDING";

    const userInDb = await prisma.user.findUnique({
      where: { email: session.user.email as string }
    });

    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
        bankId,
        categoryId,
        endDate: new Date(endDateStr),
        slug,
        status,
        authorId: userInDb?.id
      }
    });

    // Ana sayfaya veya admin paneline dönebilir. (Şimdilik response veriyoruz)
    // Server action olsaydı revalidatePath yapabilirdik. API olduğu için yönlendirme (redirect) dönebiliriz.
    const redirectUrl = isAdmin ? "/admin?success=true" : "/dashboard?success=true";
    return NextResponse.redirect(new URL(redirectUrl, req.url), 303);

  } catch (error) {
    console.error("Kampanya ekleme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
