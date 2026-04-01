import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import BrandActions from "../markalar/BrandActions";
import { notFound, redirect } from "next/navigation";

const prisma = new PrismaClient();

export const metadata = { title: "Kredi Kartı Yönetimi | Admin" };

export default async function AdminCardsPage() {
  const cards = await prisma.creditCard.findMany({
    orderBy: { name: "asc" },
    include: {
      brand: { include: { category: true } },
      _count: { select: { campaigns: true } },
    },
  });

  return (
    <div className="p-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">💳 Kredi Kartı Yönetimi</h1>
          <p className="text-slate-500 text-sm mt-1">{cards.length} kart kayıtlı</p>
        </div>
        <Link href="/admin/kartlar/yeni" className="btn-primary px-5 py-2.5 rounded-xl font-black text-sm text-white">
          + Yeni Kart Ekle
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-800">{cards.length}</div>
          <div className="text-slate-500 text-xs font-semibold">Toplam Kart</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-emerald-600">{cards.filter(c => c.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Aktif</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="text-2xl font-black text-slate-400">{cards.filter(c => !c.isActive).length}</div>
          <div className="text-slate-500 text-xs font-semibold">Pasif</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kart</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Banka / Marka</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Kampanyalar</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Durum</th>
                <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cards.map(card => (
                <tr key={card.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden">
                        {card.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-black text-[9px] px-1 text-center">{card.name}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm">{card.name}</div>
                        <div className="text-slate-400 text-xs font-mono">/{card.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 flex-shrink-0">
                        {card.brand.logoUrl ? (
                          <img src={card.brand.logoUrl} alt={card.brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <span className="text-[10px] font-black text-slate-500">{card.brand.name[0]}</span>
                        )}
                      </div>
                      <span className="text-slate-700 text-sm font-semibold">{card.brand.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-600 text-sm font-semibold">{card._count.campaigns}</span>
                  </td>
                  <td className="px-6 py-4">
                    <BrandActions id={card.id} isActive={card.isActive} entity="card" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/kartlar/${card.id}`} className="text-indigo-600 text-xs font-black hover:underline">
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
