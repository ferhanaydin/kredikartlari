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

  if (id) {
    await prisma.creditCard.update({ where: { id }, data: { name, slug, imageUrl, brandId } });
  } else {
    await prisma.creditCard.create({ data: { name, slug, imageUrl, brandId } });
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
            <div className="flex items-start gap-4">
              {/* Kart animasyonlu önizleme */}
              <div className="flex-shrink-0">
                <div className="w-28 h-[72px] rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 shadow-lg relative overflow-hidden">
                  <div className="absolute top-2 left-2 w-5 h-3.5 rounded bg-yellow-300/30 border border-yellow-200/40"></div>
                  <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-white/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/60 text-[9px] font-black text-center px-1">{card?.name || "Kart Adı"}</span>
                  </div>
                </div>
                <p className="text-slate-400 text-[10px] text-center mt-1 font-semibold">Önizleme</p>
              </div>
              <div className="flex-1">
                <ImageUpload
                  name="imageUrl"
                  currentUrl={card?.imageUrl}
                  folder="cards"
                  shape="card"
                  label="Kart Resmi Yükle"
                />
              </div>
            </div>
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
