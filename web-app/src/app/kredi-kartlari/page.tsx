import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";
import LoadMoreGrid from "@/components/LoadMoreGrid";

const prisma = new PrismaClient();

export const metadata = {
  title: "Kredi Kartları | KrediKartlari.net",
  description: "Bonus, Axess, Maximum, World ve tüm kredi kartlarının kampanyaları.",
};

export default async function CreditCardsPage() {
  const cards = await prisma.creditCard.findMany({
    orderBy: { name: "asc" },
    include: {
      brand: true,
      _count: { select: { campaigns: true } },
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
      <div className="bg-orb bg-orb-3"></div>
      <Header />

      <main className="flex-1 relative z-10">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-widest mb-4">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-indigo-600">Kredi Kartları</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  Kredi <span className="highlight-gradient">Kartları</span>
                </h1>
                <p className="text-slate-500 text-sm">Tüm kartların avantajlarını karşılaştırın ve en iyisini seçin.</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl">
                <span className="text-indigo-700 font-black text-2xl">{cards.length}</span>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest ml-2">Kart</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Grid */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <LoadMoreGrid initialCount={5} step={20}>
            {cards.map((card, i) => (
              <Link
                key={card.id}
                href={`/markalar/${card.brand.slug}/${card.slug}`}
                className="group bg-white border border-slate-200 p-4 rounded-2xl hover:border-indigo-300 hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3"
                style={{ animation: `fadeInUp 0.4s ease forwards ${i * 0.04}s`, opacity: 0 }}
              >
                {/* Card visual */}
                <div className="relative w-full aspect-[1.586/1] rounded-xl flex items-center justify-center shadow-lg group-hover:-rotate-1 transition-transform duration-500 overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500">
                  {card.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <>
                      <div className="absolute top-2 left-2.5 w-5 h-3.5 rounded bg-yellow-300/30 border border-yellow-200/40"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/10 border border-white/20"></div>
                      <span className="text-white font-black text-xs tracking-tight z-10 px-1 text-center leading-tight">
                        {card.brand.name}
                      </span>
                    </>
                  )}
                </div>

                <div className="w-full">
                  <h2 className="text-slate-800 font-black text-sm group-hover:text-indigo-600 transition-colors truncate">{card.name}</h2>
                  <p className="text-slate-400 text-[11px] font-semibold mt-0.5">{card._count.campaigns} fırsat</p>
                </div>
              </Link>
            ))}
          </LoadMoreGrid>
        </section>

        {/* Latest Campaigns */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              Kartlara Özel <span className="highlight-gradient">Son Fırsatlar</span>
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
