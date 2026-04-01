import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import IconPicker from "@/components/admin/IconPicker";
import SlugGenerator from "@/components/admin/SlugGenerator";

const prisma = new PrismaClient();

async function saveAvantaj(formData: FormData) {
  "use server";
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const icon = (formData.get("icon") as string) || null;

  if (id) {
    await prisma.avantaj.update({ 
      where: { id }, 
      data: { name, slug, icon } 
    });
  } else {
    await prisma.avantaj.create({ 
      data: { name, slug, icon } 
    });
  }
  revalidatePath("/admin/avantajlar");
  revalidatePath("/");
  redirect("/admin/avantajlar");
}

export default async function AvantajFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "yeni";
  const av = !isNew ? await prisma.avantaj.findUnique({ where: { id } }) : null;
  if (!isNew && !av) notFound();

  const inputClass = "w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all";
  const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">
          {isNew ? "⭐ Yeni Avantaj Ekle" : `✏️ Düzenle: ${av?.name}`}
        </h1>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
        <form action={saveAvantaj} className="space-y-5">
          <SlugGenerator sourceName="name" targetName="slug" />
          {av?.id && <input type="hidden" name="id" value={av.id} />}

          <div>
            <label className={labelClass}>Avantaj Adı *</label>
            <input type="text" name="name" required defaultValue={av?.name} placeholder="Puan Kazanma" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>SEO Slug *</label>
              <input type="text" name="slug" required defaultValue={av?.slug} placeholder="puan-kazanma" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Emoji İkon</label>
              <input type="text" name="icon" defaultValue={av?.icon || ""} placeholder="⭐" className={inputClass + " text-2xl"} maxLength={4} />
            </div>
          </div>

          {/* Quick Icon Picker */}
          <div>
            <p className={labelClass}>Hızlı Seçim</p>
            <IconPicker />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl font-black text-sm text-white">
              {isNew ? "🚀 Avantajı Kaydet" : "✓ Güncelle"}
            </button>
            <a href="/admin/avantajlar" className="btn-outline px-6 py-2.5 rounded-xl font-black text-sm">İptal</a>
          </div>
        </form>
      </div>
    </div>
  );
}
