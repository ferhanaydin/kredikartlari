import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import ImageUpload from "@/components/admin/ImageUpload";
import SlugGenerator from "@/components/admin/SlugGenerator";

const prisma = new PrismaClient();

async function saveBrand(formData: FormData) {
  "use server";
  const id = formData.get("id") as string | null;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const logoUrl = (formData.get("logoUrl") as string) || null;
  const categoryId = formData.get("categoryId") as string;

  if (id) {
    await prisma.brand.update({ where: { id }, data: { name, slug, logoUrl, categoryId } });
  } else {
    await prisma.brand.create({ data: { name, slug, logoUrl, categoryId } });
  }
  revalidatePath("/admin/markalar");
  revalidatePath("/");
  redirect("/admin/markalar");
}

export default async function BrandFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "yeni";

  const [categories, brand] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    !isNew ? prisma.brand.findUnique({ where: { id } }) : Promise.resolve(null),
  ]);

  if (!isNew && !brand) notFound();

  const inputClass = "w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all";
  const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">
          {isNew ? "🏢 Yeni Marka Ekle" : `✏️ Düzenle: ${brand?.name}`}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isNew ? "Yeni bir marka veya banka kaydı oluşturun." : "Marka bilgilerini güncelleyin."}
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <form action={saveBrand} className="space-y-5">
          <SlugGenerator sourceName="name" targetName="slug" />
          {brand?.id && <input type="hidden" name="id" value={brand.id} />}

          {/* Logo Upload */}
          <div>
            <label className={labelClass}>Logo</label>
            <ImageUpload
              name="logoUrl"
              currentUrl={brand?.logoUrl}
              folder="logos"
              shape="square"
              label="Logo Yükle"
            />
            <p className="text-slate-400 text-xs mt-2">PNG veya SVG, şeffaf arka planlı önerilir.</p>
          </div>

          <hr className="border-slate-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Marka Adı *</label>
              <input type="text" name="name" required defaultValue={brand?.name} placeholder="Garanti BBVA" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SEO Slug *</label>
              <input type="text" name="slug" required defaultValue={brand?.slug} placeholder="garanti-bbva" className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Sektör / Kategori *</label>
            <select name="categoryId" required defaultValue={brand?.categoryId} className={inputClass + " cursor-pointer"}>
              <option value="">Sektör Seçin...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary px-6 py-2.5 rounded-xl font-black text-sm text-white">
              {isNew ? "🚀 Markayı Kaydet" : "✓ Güncelle"}
            </button>
            <a href="/admin/markalar" className="btn-outline px-6 py-2.5 rounded-xl font-black text-sm">İptal</a>
          </div>
        </form>
      </div>
    </div>
  );
}
