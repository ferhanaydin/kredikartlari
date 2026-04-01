import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ slug: string, cardSlug: string }> }) {
  const { slug, cardSlug } = await params;
  const card = await prisma.creditCard.findFirst({
    where: { slug: cardSlug, brand: { slug: slug }, isActive: true },
    select: { name: true, brand: { select: { name: true } } }
  });
  if (!card) return { title: "Kart Bulunamadı" };
  return {
    title: `${card.name} (${card.brand.name}) Kampanyaları | KrediKartlari.net`,
    description: `${card.brand.name} ${card.name} kredi kartı sahiplerine özel avantajlar, kampanyalar ve taksit fırsatları.`,
  };
}

export default async function CardDetailPage({ params }: { params: Promise<{ slug: string, cardSlug: string }> }) {
  const { slug, cardSlug } = await params;

  const card = await prisma.creditCard.findFirst({
    where: { 
      slug: cardSlug, 
      brand: { slug: slug },
      isActive: true 
    },
    include: {
      brand: { include: { category: true } },
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

  if (!card) notFound();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <Header />

      <main className="flex-1 relative z-10">
        {/* Card Hero */}
        <section className="bg-white border-b border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-widest mb-6">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/markalar" className="hover:text-indigo-600 transition-colors">Markalar</Link>
              <span>/</span>
              <Link href={`/markalar/${card.brand.slug}`} className="hover:text-indigo-600 transition-colors">{card.brand.name}</Link>
              <span>/</span>
              <span className="text-indigo-600">{card.name}</span>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Card Image */}
              <div className="w-32 md:w-40 aspect-[1.6/1] rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-500 shadow-xl flex items-center justify-center p-0.5 flex-shrink-0 relative overflow-hidden transform perspective-1000 rotate-y-3 hover:rotate-y-0 transition-transform duration-500">
                {card.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover rounded-[14px]" />
                ) : (
                  <>
                    <div className="absolute top-3 left-3 w-6 h-4 rounded bg-yellow-300/30 border border-yellow-200/40"></div>
                    <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-white/10"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                      <span className="text-white font-black text-sm text-center leading-tight">{card.name}</span>
                      <span className="text-white/60 text-[10px] mt-1 uppercase tracking-widest">{card.brand.name}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3 items-center">
                  <Link href={`/markalar/${card.brand.slug}`} className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-full transition-colors group">
                    {card.brand.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.brand.logoUrl} alt={card.brand.name} className="w-4 h-4 object-contain" />
                    ) : (
                      <span className="text-[10px] bg-slate-200 w-4 h-4 rounded-full flex items-center justify-center">🏢</span>
                    )}
                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{card.brand.name}</span>
                  </Link>
                  {card.brand.category && (
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      {card.brand.category.icon} {card.brand.category.name}
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">
                  {card.name}
                </h1>
                <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl">
                  {card.brand.name} {card.name} ile ilgili güncel tüm kampanyalar, size özel avantajlar ve fırsatlar.
                </p>
              </div>

              <div className="flex gap-3 flex-wrap">
                <div className="bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl text-center min-w-[120px]">
                  <div className="text-indigo-700 font-black text-3xl">{card.campaigns.length}</div>
                  <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">Özel Kampanya</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaigns */}
        <section className="max-w-7xl mx-auto px-6 py-12 pb-20">
          {card.campaigns.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="text-5xl mb-4">💳</div>
              <p className="text-slate-500 text-lg font-bold">Bu karta özel aktif kampanya bulunmuyor.</p>
              <Link href={`/markalar/${card.brand.slug}`} className="mt-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-6 py-2 rounded-xl text-sm font-bold transition-colors inline-block">
                Markanın tüm kampanyalarına bak →
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">🎁</div>
                <h2 className="text-2xl font-black text-slate-800">
                  {card.name} Fırsatları
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {card.campaigns.map((camp, i) => (
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
