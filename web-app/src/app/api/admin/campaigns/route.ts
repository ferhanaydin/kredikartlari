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
    const id = formData.get("id") as string | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    
    const summary = formData.get("summary") as string | null;
    const keywords = formData.get("keywords") as string | null;
    
    // Çoklu seçimleri al
    const brandIds = formData.getAll("brandIds") as string[];
    const categoryIds = formData.getAll("categoryIds") as string[];
    const cardIds = formData.getAll("cardIds") as string[];
    const avantajIds = formData.getAll("avantajIds") as string[];

    const endDateStr = formData.get("endDate") as string;
    const slug = formData.get("slug") as string;

    if (!title || !description || brandIds.length === 0 || categoryIds.length === 0 || !endDateStr || !slug) {
      return NextResponse.json({ message: "Eksik alanlar var (Başlık, Açıklama, En az bir Firma ve Sektör seçilmelidir)." }, { status: 400 });
    }

    // Rol ve İzin Kontrolleri
    // @ts-ignore
    const userRole = session.user.role;
    // @ts-ignore
    const userBrandId = session.user.brandId;
    // @ts-ignore
    const isUserApproved = session.user.isApproved;

    let status: "PENDING" | "PUBLISHED" = "PENDING";
    let canPostAnyBank = userRole === "ADMIN" || userRole === "EDITOR";
    let canPostThisBank = false;

    if (canPostAnyBank) {
      status = "PUBLISHED";
      canPostThisBank = true;
    } else if (userRole === "FIRMA_EDITOR") {
      if (!isUserApproved) {
        return NextResponse.json({ message: "Hesabınız henüz onaylanmadı." }, { status: 403 });
      }
      // Firma editörü sadece kendi markasının olduğu kampanyaları ekleyebilir
      // En az bir ana marka kendi markası olmalı
      if (brandIds.includes(userBrandId)) {
        status = "PUBLISHED";
        canPostThisBank = true;
      } else {
        return NextResponse.json({ message: "Sadece kendi firmanız adına kampanya ekleyebilirsiniz." }, { status: 403 });
      }
    } else {
      // Normal kullanıcı
      status = "PENDING";
      canPostThisBank = true; 
    }

    if (!canPostThisBank) {
      return NextResponse.json({ message: "Bu işlem için yetkiniz yok." }, { status: 403 });
    }

    // UPDATE EXISITING
    if (id) {
      const existing = await prisma.campaign.findUnique({ where: { id }, select: { authorId: true, brands: true } });
      if (!existing) {
        return NextResponse.json({ message: "Kampanya bulunamadı." }, { status: 404 });
      }

      // Check author permissions
      if (userRole !== "ADMIN") {
        if (existing.authorId !== session.user.id && !existing.brands.some(b => b.id === userBrandId)) {
          return NextResponse.json({ message: "Bu kampanyayı düzenleme yetkiniz yok." }, { status: 403 });
        }
      }

      // @ts-ignore
      await prisma.campaign.update({
        where: { id },
        data: {
          title,
          description,
          summary: summary || null,
          keywords: keywords || null,
          imageUrl: imageUrl || null,
          endDate: new Date(endDateStr),
          slug,
          status,
          // Update relations tightly
          brands: { set: brandIds.map(id => ({ id })) },
          categories: { set: categoryIds.map(id => ({ id })) },
          creditCards: { set: cardIds.map(id => ({ id })) },
          avantajlar: { set: avantajIds.map(id => ({ id })) },
        }
      });
    } else {
      // CREATE NEW
      const userInDb = await prisma.user.findUnique({
        where: { email: session.user.email as string }
      });

      // @ts-ignore
      await prisma.campaign.create({
        data: {
          title,
          description,
          summary: summary || null,
          keywords: keywords || null,
          imageUrl: imageUrl || null,
          endDate: new Date(endDateStr),
          slug,
          status,
          authorId: userInDb?.id,
          brands: { connect: brandIds.map(id => ({ id })) },
          categories: { connect: categoryIds.map(id => ({ id })) },
          creditCards: { connect: cardIds.map(id => ({ id })) },
          avantajlar: { connect: avantajIds.map(id => ({ id })) },
        }
      });
    }

    // Ana sayfaya veya admin paneline dönebilir.
    const redirectUrl = canPostAnyBank ? "/admin?success=true" : "/dashboard?success=true";
    return NextResponse.redirect(new URL(redirectUrl, req.url), 303);

  } catch (error) {
    console.error("Kampanya ekleme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu." }, { status: 500 });
  }
}
