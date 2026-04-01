import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import BrandActions from "../markalar/BrandActions";

const prisma = new PrismaClient();
export const metadata = { title: "Avantaj Yönetimi | Admin" };

export default async function AdminAvantajlarPage() {
  const avantajlar = await prisma.avantaj.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { campaigns: true } } },
  });

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">⭐ Avantaj Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">{avantajlar.length} avantaj türü kayıtlı</p>
        </div>
        <Link href="/admin/avantajlar/yeni" className="btn-primary px-5 py-2.5 rounded-xl font-black text-sm text-white">
          + Yeni Avantaj Ekle
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-800">{avantajlar.length}</div>
          <div className="text-slate-500 text-xs font-semibold">Toplam Avantaj</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-emerald-600">{avantajlar.filter(a => a.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Aktif</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-400">{avantajlar.filter(a => !a.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Pasif</div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {avantajlar.map((av, i) => (
          <div key={av.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            style={{ animation: `fadeInUp 0.4s ease forwards ${i * 0.05}s`, opacity: 0 }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl">
                  {av.icon || "⭐"}
                </div>
                <div>
                  <h3 className="font-black text-slate-800">{av.name}</h3>
                  <p className="text-slate-400 text-xs font-mono">/{av.slug}</p>
                </div>
              </div>
              <BrandActions id={av.id} isActive={av.isActive} entity="avantaj" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-slate-500 text-xs font-semibold">
                {av._count.campaigns} kampanyada kullanılıyor
              </span>
              <Link href={`/admin/avantajlar/${av.id}`} className="text-indigo-600 text-xs font-black hover:underline flex items-center gap-1">
                Düzenle →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
