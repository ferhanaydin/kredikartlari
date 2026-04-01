import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";
import LoadMoreGrid from "@/components/LoadMoreGrid";

const prisma = new PrismaClient();

export const metadata = {
  title: "Sektörler | Kredi Kartı Kampanyaları | KrediKartlari.net",
  description: "Market, elektronik, akaryakıt ve daha fazlası. Tüm sektörlerdeki kredi kartı kampanyalarını keşfedin.",
};

export default async function SectorListPage() {
  const sectors = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { campaigns: true, brands: true } },
    },
  });

  const latestCampaigns = await prisma.campaign.findMany({
    where: { status: "PUBLISHED" },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      brands: true,
      categories: true,
      creditCards: { include: { brand: true } },
      avantajlar: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <Header />

      <main className="flex-1 relative z-10">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-indigo-600">Sektörler</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Tüm <span className="highlight-gradient">Sektörler</span>
                </h1>
                <p className="text-slate-500 text-sm max-w-lg">
                  Harcama kategorinize göre en avantajlı kampanyaları keşfedin.
                </p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl">
                <span className="text-indigo-700 font-black text-2xl">{sectors.length}</span>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest ml-2">Sektör</span>
              </div>
            </div>
          </div>
        </section>

        {/* Sectors Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <LoadMoreGrid initialCount={5} step={20}>
            {sectors.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/sektorler/${cat.slug}`}
                className="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3"
                style={{ animation: `fadeInUp 0.4s ease forwards ${i * 0.04}s`, opacity: 0 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-3xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300">
                  {cat.icon || "🏷️"}
                </div>
                <div>
                  <h2 className="text-slate-800 font-black text-[15px] group-hover:text-indigo-600 transition-colors">{cat.name}</h2>
                  <p className="text-slate-400 text-xs font-semibold mt-1">{cat._count.campaigns} kampanya</p>
                </div>
                <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                  Keşfet
                  <svg className="group-hover:translate-x-0.5 transition-transform" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </Link>
            ))}
          </LoadMoreGrid>
        </section>

        {/* Latest Campaigns */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                En Son <span className="highlight-gradient">Kampanyalar</span>
              </h2>
              <p className="text-slate-500 text-sm mt-1">Tüm sektörlerden en güncel fırsatlar</p>
            </div>
            <Link href="/" className="text-indigo-600 font-bold text-sm hover:text-indigo-700 flex items-center gap-1 group">
              Tümü
              <svg className="group-hover:translate-x-0.5 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestCampaigns.map((camp, i) => (
              <CampaignCard key={camp.id} campaign={camp} index={i} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
