import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      brands: true,
      author: true,
    }
  });

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            🎯 Tüm Kampanyalar
          </h1>
          <p className="text-slate-500 text-sm mt-1">Sistemdeki yayınlanmış ve onay bekleyen tüm kampanyalar.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Görsel</th>
                <th className="px-6 py-4">Başlık & Marka</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4">Tarih</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-semibold">
                    Henüz kampanya bulunmuyor.
                  </td>
                </tr>
              ) : (
                campaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      {camp.imageUrl ? (
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={camp.imageUrl} alt={camp.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-semibold">
                          Yok
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800 line-clamp-1">{camp.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {camp.brands.length > 0 ? camp.brands.map(b => b.name).join(", ") : "Marka Yok"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {camp.status === "PUBLISHED" ? (
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide">YAYINDA</span>
                      ) : camp.status === "PENDING" ? (
                        <span className="bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide">BEKLİYOR</span>
                      ) : (
                        <span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-md text-[10px] font-black tracking-wide">REDDEDİLDİ</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {new Date(camp.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/kampanya-duzenle/${camp.id}`} 
                        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-xs font-black transition-colors"
                      >
                        ✏️ Düzenle
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
