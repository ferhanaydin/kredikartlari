import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import BrandActions from "../markalar/BrandActions";

const prisma = new PrismaClient();
export const metadata = { title: "Sektör Yönetimi | Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { campaigns: true, brands: true } } },
  });

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">🏷️ Sektör Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">{categories.length} sektör kayıtlı</p>
        </div>
        <Link href="/admin/sektorler/yeni" className="btn-primary px-5 py-2.5 rounded-xl font-black text-sm text-white">
          + Yeni Sektör Ekle
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-800">{categories.length}</div>
          <div className="text-slate-500 text-xs font-semibold">Toplam Sektör</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-emerald-600">{categories.filter(c => c.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Aktif</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-400">{categories.filter(c => !c.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Pasif</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Sektör</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Markalar</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kampanyalar</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Durum</th>
                <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                        {cat.icon || "🏷️"}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm">{cat.name}</div>
                        <div className="text-slate-400 text-xs font-mono">/{cat.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-slate-600 text-sm font-semibold">{cat._count.brands}</span></td>
                  <td className="px-6 py-4"><span className="text-slate-600 text-sm font-semibold">{cat._count.campaigns}</span></td>
                  <td className="px-6 py-4"><BrandActions id={cat.id} isActive={cat.isActive} entity="category" /></td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/sektorler/${cat.id}`} className="text-indigo-600 text-xs font-black hover:underline">Düzenle →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
