import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  // Sadece admin erişimi
  const session = await auth();
  // @ts-ignore
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "kredikartlari";

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    // Dosya boyutu kontrolü: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Dosya 5MB'dan büyük olamaz" }, { status: 400 });
    }

    // Desteklenen formatlar
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya formatı (JPG, PNG, WebP, SVG)" }, { status: 400 });
    }

    // Dosyayı Buffer'a çevir
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cloudinary'e yükle (stream olarak)
    const result = await new Promise<{ secure_url: string; public_id: string; width: number; height: number }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `kredikartlari/${folder}`,
              resource_type: "image",
              // Tüm yüklemeleri WebP'ye dönüştür
              format: "webp",
              transformation: [
                // Kalite optimizasyonu (WebP için ideal)
                { quality: "auto:good" },
              ],
            },
            (error, result) => {
              if (error || !result) reject(error || new Error("Upload failed"));
              else resolve(result as any);
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Yükleme sırasında hata oluştu" }, { status: 500 });
  }
}
