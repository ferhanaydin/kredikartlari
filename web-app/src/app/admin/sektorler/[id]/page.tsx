import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import SlugGenerator from "@/components/admin/SlugGenerator";
import IconPicker from "@/components/admin/IconPicker";

const prisma = new PrismaClient();

async function saveCat(formData: FormData) {
  "use server";
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const icon = (formData.get("icon") as string) || null;
  const seoTitle = formData.get("seoTitle") as string | null;
  const seoDescription = formData.get("seoDescription") as string | null;
  const keywords = formData.get("keywords") as string | null;

  const data = { name, slug, icon, seoTitle, seoDescription, keywords };

  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }
  revalidatePath("/admin/sektorler");
  revalidatePath("/");
  redirect("/admin/sektorler");
}

export default async function CategoryFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "yeni";
  const cat = !isNew ? await prisma.category.findUnique({ where: { id } }) : null;
  if (!isNew && !cat) notFound();

  const inputClass = "w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all";
  const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">
          {isNew ? "🏷️ Yeni Sektör Ekle" : `✏️ Düzenle: ${cat?.name}`}
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-5">
        <form action={saveCat} className="space-y-5">
          <SlugGenerator sourceName="name" targetName="slug" />
          {cat?.id && <input type="hidden" name="id" value={cat.id} />}

          <div>
            <label className={labelClass}>Sektör Adı *</label>
            <input type="text" name="name" required defaultValue={cat?.name} placeholder="Market" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SEO Slug *</label>
              <input type="text" name="slug" required defaultValue={cat?.slug} placeholder="market" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Emoji İkon</label>
              <input type="text" name="icon" defaultValue={cat?.icon || ""} placeholder="🛒" className={inputClass + " text-2xl"} maxLength={4} />
              <IconPicker />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 mt-6">
            <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
              🔍 SEO Ayarları
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Opsiyonel</span>
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={labelClass}>SEO Başlığı (Title)</label>
                <input type="text" name="seoTitle" defaultValue={cat?.seoTitle || ""} placeholder="En İyi Market Kampanyaları | Kredi Kartları" className={inputClass} />
                <p className="text-[10px] text-slate-400 mt-1 italic">Boş bırakılırsa normal isim kullanılır.</p>
              </div>

              <div>
                <label className={labelClass}>SEO Açıklaması (Meta Description)</label>
                <textarea name="seoDescription" defaultValue={cat?.seoDescription || ""} rows={3} placeholder="Market alışverişlerinizde puan kazandıran kredi kartı kampanyaları..." className={inputClass + " resize-none"} />
              </div>

              <div>
                <label className={labelClass}>Anahtar Kelimeler (Keywords)</label>
                <input type="text" name="keywords" defaultValue={cat?.keywords || ""} placeholder="market, alışveriş, puan, indirim" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-2xl shadow-sm">
              {cat?.icon || "🏷️"}
            </div>
            <div>
              <p className="text-indigo-800 font-black text-sm">{cat?.name || "Sektör Adı"}</p>
              <p className="text-indigo-400 text-xs">/{cat?.slug || "sektor-slug"}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl font-black text-sm text-white">
              {isNew ? "🚀 Sektörü Kaydet" : "✓ Güncelle"}
            </button>
            <a href="/admin/sektorler" className="btn-outline px-6 py-2.5 rounded-xl font-black text-sm">İptal</a>
          </div>
        </form>
      </div>
    </div>
  );
}
