import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";
import LoadMoreGrid from "@/components/LoadMoreGrid";

const prisma = new PrismaClient();

export const metadata = {
  title: "Anlaşmalı Bankalar | KrediKartlari.net",
  description: "Garanti BBVA, Yapı Kredi, Akbank ve tüm bankaların kampanyaları tek adreste.",
};

export default async function BanksPage() {
  const banks = await prisma.brand.findMany({
    where: { category: { slug: "banka" } },
    orderBy: { name: "asc" },
    include: {
      _count: { select: { campaigns: true } },
      creditCards: true,
    },
  });

  const latestCampaigns = await prisma.campaign.findMany({
    where: {
      status: "PUBLISHED",
      brands: { some: { category: { slug: "banka" } } },
    },
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
              <span className="text-indigo-600">Bankalar</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Anlaşmalı <span className="highlight-gradient">Bankalar</span>
                </h1>
                <p className="text-slate-500 text-sm">Türkiye&apos;nin önde gelen bankalarının tüm kredi kartı kampanyaları.</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl">
                <span className="text-indigo-700 font-black text-2xl">{banks.length}</span>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest ml-2">Banka</span>
              </div>
            </div>
          </div>
        </section>

        {/* Banks Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <LoadMoreGrid initialCount={5} step={20}>
            {banks.map((bank, i) => (
              <Link
                key={bank.id}
                href={`/markalar/${bank.slug}`}
                className="group bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-4"
                style={{ animation: `fadeInUp 0.4s ease forwards ${i * 0.04}s`, opacity: 0 }}
              >
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center p-3 group-hover:border-indigo-100 group-hover:shadow-md transition-all">
                  {bank.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={bank.logoUrl} alt={bank.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-2xl">
                      {bank.name[0]}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-slate-800 font-black text-base group-hover:text-indigo-600 transition-colors">{bank.name}</h2>
                  <p className="text-slate-400 text-[11px] font-semibold mt-1">{bank._count.campaigns} kampanya</p>
                </div>

                {bank.creditCards.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 w-full pt-3 border-t border-slate-100">
                    {bank.creditCards.slice(0, 3).map(card => (
                      <span key={card.id} className="text-[9px] text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full font-bold">
                        {card.name}
                      </span>
                    ))}
                    {bank.creditCards.length > 3 && (
                      <span className="text-[9px] text-indigo-400 font-bold">+{bank.creditCards.length - 3}</span>
                    )}
                  </div>
                )}
              </Link>
            ))}
          </LoadMoreGrid>
        </section>

        {/* Latest Campaigns */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Bankalardan <span className="highlight-gradient">Son Fırsatlar</span>
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
