import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";
import LoadMoreGrid from "@/components/LoadMoreGrid";

const prisma = new PrismaClient();

export const metadata = {
  title: "Avantajlar | Kredi Kartı Kampanyaları | KrediKartlari.net",
  description: "Puan, mil, nakit iade, taksit ve daha fazlası. Avantaj türüne göre kampanyaları keşfedin.",
};

export default async function AvantajlarPage() {
  const avantajlar = await prisma.avantaj.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { campaigns: true } } },
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

  const avantajColors = [
    "bg-amber-50 text-amber-700 border-amber-200",
    "bg-emerald-50 text-emerald-700 border-emerald-200",
    "bg-sky-50 text-sky-700 border-sky-200",
    "bg-violet-50 text-violet-700 border-violet-200",
    "bg-rose-50 text-rose-700 border-rose-200",
    "bg-indigo-50 text-indigo-700 border-indigo-200",
    "bg-orange-50 text-orange-700 border-orange-200",
    "bg-teal-50 text-teal-700 border-teal-200",
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-3"></div>
      <Header />

      <main className="flex-1 relative z-10">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-indigo-600">Avantajlar</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Avantaj <span className="highlight-gradient">Türleri</span>
                </h1>
                <p className="text-slate-500 text-sm">Kazanmak istediğiniz avantajı seçin, kampanyaları keşfedin.</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl">
                <span className="text-indigo-700 font-black text-2xl">{avantajlar.length}</span>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest ml-2">Avantaj Türü</span>
              </div>
            </div>
          </div>
        </section>

        {/* Avantajlar Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <LoadMoreGrid initialCount={5} step={20}>
            {avantajlar.map((av, i) => (
              <Link
                key={av.id}
                href={`/avantajlar/${av.slug}`}
                className="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-violet-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3"
                style={{ animation: `fadeInUp 0.4s ease forwards ${i * 0.04}s`, opacity: 0 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-3xl flex items-center justify-center group-hover:bg-violet-50 group-hover:scale-110 transition-all duration-300">
                  {av.icon || "⭐"}
                </div>
                <div>
                  <h2 className="text-slate-800 font-black text-[15px] group-hover:text-violet-600 transition-colors">{av.name}</h2>
                  <p className="text-slate-400 text-xs font-semibold mt-1">{av._count.campaigns} fırsat</p>
                </div>
              </Link>
            ))}
          </LoadMoreGrid>
        </section>

        {/* Latest Campaigns */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              En Son <span className="highlight-gradient">Kampanyalar</span>
            </h2>
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
