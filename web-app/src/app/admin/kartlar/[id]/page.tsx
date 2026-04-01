import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SlugGenerator from "@/components/admin/SlugGenerator";
import ImageUpload from "@/components/admin/ImageUpload";

const prisma = new PrismaClient();

async function saveCard(formData: FormData) {
  "use server";
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const imageUrl = (formData.get("imageUrl") as string) || null;
  const brandId = formData.get("brandId") as string;
  const seoTitle = formData.get("seoTitle") as string | null;
  const seoDescription = formData.get("seoDescription") as string | null;
  const keywords = formData.get("keywords") as string | null;

  const data = { name, slug, imageUrl, brandId, seoTitle, seoDescription, keywords };

  if (id) {
    await prisma.creditCard.update({ where: { id }, data });
  } else {
    await prisma.creditCard.create({ data });
  }
  revalidatePath("/admin/kartlar");
  revalidatePath("/");
  redirect("/admin/kartlar");
}

export default async function CardFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "yeni";

  const [brands, card] = await Promise.all([
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    !isNew ? prisma.creditCard.findUnique({ where: { id } }) : Promise.resolve(null),
  ]);

  if (!isNew && !card) notFound();

  const inputClass = "w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all";
  const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">
          {isNew ? "💳 Yeni Kart Ekle" : `✏️ Düzenle: ${card?.name}`}
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <form action={saveCard} className="space-y-5">
          <SlugGenerator sourceName="name" targetName="slug" />
          {card?.id && <input type="hidden" name="id" value={card.id} />}

          {/* Card Image Upload */}
          <div>
            <label className={labelClass}>Kart Görseli</label>
            <ImageUpload
              name="imageUrl"
              currentUrl={card?.imageUrl}
              folder="cards"
              shape="card"
              label="Kart Resmi Yükle"
            />
            <p className="text-slate-400 text-[10px] mt-2">Kartın ön yüzünün net bir fotoğrafını yükleyin.</p>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Kart Adı *</label>
              <input type="text" name="name" required defaultValue={card?.name} placeholder="Bonus Card" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SEO Slug *</label>
              <input type="text" name="slug" required defaultValue={card?.slug} placeholder="bonus-card" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Banka / Marka *</label>
            <select name="brandId" required defaultValue={card?.brandId} className={inputClass + " cursor-pointer"}>
              <option value="">Marka Seçin...</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              🔍 SEO Ayarları
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Opsiyonel</span>
            </h3>
            
            <div className="space-y-4 px-6 pb-6">
              <div>
                <label className={labelClass}>SEO Başlığı (Title)</label>
                <input type="text" name="seoTitle" defaultValue={card?.seoTitle || ""} placeholder="Garanti Bonus Kredi Kartı Kampanyaları" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>SEO Açıklaması (Meta Description)</label>
                <textarea name="seoDescription" defaultValue={card?.seoDescription || ""} rows={3} placeholder="Garanti Bonus kart taksit, puan ve özel indirim fırsatları..." className={inputClass + " resize-none"} />
              </div>

              <div>
                <label className={labelClass}>Anahtar Kelimeler (Keywords)</label>
                <input type="text" name="keywords" defaultValue={card?.keywords || ""} placeholder="bonus, kredi kartı, puan, taksit" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl font-black text-sm text-white">
              {isNew ? "🚀 Kartı Kaydet" : "✓ Güncelle"}
            </button>
            <a href="/admin/kartlar" className="btn-outline px-6 py-2.5 rounded-xl font-black text-sm">İptal</a>
          </div>
        </form>
      </div>
    </div>
  );
}
