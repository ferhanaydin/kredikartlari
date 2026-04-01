import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import BrandActions from "./BrandActions";

const prisma = new PrismaClient();

export const metadata = { title: "Marka Yönetimi | Admin" };

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      category: true,
      _count: { select: { campaigns: true, creditCards: true } },
    },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">🏢 Marka Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">{brands.length} marka kayıtlı</p>
        </div>
        <Link href="/admin/markalar/yeni" className="btn-primary px-5 py-2.5 rounded-xl font-black text-sm text-white">
          + Yeni Marka Ekle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-800">{brands.length}</div>
          <div className="text-slate-500 text-xs font-semibold">Toplam Marka</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-emerald-600">{brands.filter(b => b.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Aktif</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-400">{brands.filter(b => !b.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Pasif</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Marka</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Sektör</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kartlar</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kampanyalar</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Durum</th>
                <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {brands.map(brand => (
                <tr key={brand.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-sm flex-shrink-0">
                        {brand.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white font-black text-sm">
                            {brand.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm">{brand.name}</div>
                        <div className="text-slate-400 text-xs font-mono">/{brand.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-black border border-indigo-100 px-2.5 py-1 rounded-full">
                      {brand.category.icon} {brand.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 text-sm font-semibold">{brand._count.creditCards}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 text-sm font-semibold">{brand._count.campaigns}</span>
                  </td>
                  <td className="px-6 py-4">
                    <BrandActions id={brand.id} isActive={brand.isActive} entity="brand" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/markalar/${brand.id}`} className="text-indigo-600 text-xs font-black hover:underline">
                      Düzenle →
                    </Link>
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
