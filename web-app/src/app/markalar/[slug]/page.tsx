import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug }, select: { name: true } });
  if (!brand) return { title: "Marka Bulunamadı" };
  return {
    title: `${brand.name} Kampanyaları | KrediKartlari.net`,
    description: `${brand.name} tarafından sunulan tüm kredi kartı kampanyaları ve fırsatlar.`,
  };
}

export default async function BrandDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      category: true,
      creditCards: true,
      campaigns: {
        where: { status: "PUBLISHED" },
        include: {
          brands: true,
          categories: true,
          creditCards: { include: { brand: true } },
          avantajlar: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!brand) notFound();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <Header />

      <main className="flex-1 relative z-10">
        {/* Brand Hero */}
        <section className="bg-white border-b border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-widest mb-6">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/markalar" className="hover:text-indigo-600 transition-colors">Markalar</Link>
              <span>/</span>
              <span className="text-indigo-600">{brand!.name}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Logo */}
              <div className="w-24 h-24 rounded-3xl bg-white border-2 border-slate-100 shadow-lg flex items-center justify-center p-3 flex-shrink-0">
                {brand!.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brand!.logoUrl} alt={brand!.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black text-3xl">
                    {brand!.name[0]}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {brand!.category && (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {brand!.category.icon} {brand!.category.name}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  {brand!.name}
                  <span className="text-slate-300 font-light text-2xl ml-3">Kampanyaları</span>
                </h1>
                <p className="text-slate-500 text-sm">
                  {brand!.campaigns.length} aktif kampanya · {brand!.creditCards.length} kredi kartı
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl text-center">
                  <div className="text-indigo-700 font-black text-2xl">{brand!.campaigns.length}</div>
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Kampanya</div>
                </div>
                <div className="bg-violet-50 border border-violet-100 px-5 py-3 rounded-2xl text-center">
                  <div className="text-violet-700 font-black text-2xl">{brand!.creditCards.length}</div>
                  <div className="text-violet-400 text-[10px] font-black uppercase tracking-widest">Kart</div>
                </div>
              </div>
            </div>

            {/* Credit cards */}
            {brand!.creditCards.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {brand!.creditCards.map(card => (
                  <Link href={`/markalar/${brand!.slug}/${card.slug}`} key={card.id} className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    💳 {card.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Campaigns */}
        <section className="max-w-7xl mx-auto px-6 py-12 pb-20">
          {brand!.campaigns.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-bold">Bu markada henüz aktif kampanya yok.</p>
              <Link href="/markalar" className="mt-4 text-indigo-600 font-bold hover:underline inline-block">
                Diğer markalara bak →
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black text-slate-700 mb-6">
                Tüm Kampanyalar <span className="text-slate-400 font-light">({brand!.campaigns.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brand!.campaigns.map((camp, i) => (
                  <CampaignCard key={camp.id} campaign={camp} index={i} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
