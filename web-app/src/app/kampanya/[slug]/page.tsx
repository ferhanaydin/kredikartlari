import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractionClient from "./InteractionClient";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    // @ts-ignore
    select: { title: true, description: true, summary: true, keywords: true },
  });
  if (!campaign) return { title: "Kampanya Bulunamadı" };
  
  // @ts-ignore
  const cleanDescription = campaign.summary 
    // @ts-ignore
    ? campaign.summary 
    : campaign.description.replace(/<[^>]*>/g, "").substring(0, 160);

  return {
    title: `${campaign.title} | KrediKartlari.net`,
    description: cleanDescription,
    // @ts-ignore
    keywords: campaign.keywords ? campaign.keywords.split(",").map(k => k.trim()) : ["kredi kartı", "kampanya", "indirim"],
  };
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();

  const campaign = await prisma.campaign.findUnique({
    where: { slug },
    include: {
      brands: true,
      categories: true,
      creditCards: { include: { brand: true } },
      avantajlar: true,
      favoritedBy: { include: { user: true } },
      comments: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!campaign) notFound();

  const isFavorited = session?.user?.email
    ? campaign.favoritedBy.some((fav) => fav.user?.email === session.user?.email)
    : false;

  const primaryCategory = campaign.categories[0];
  const relatedCampaigns = primaryCategory
    ? await prisma.campaign.findMany({
        where: {
          categories: { some: { id: primaryCategory.id } },
          id: { not: campaign.id },
          status: "PUBLISHED",
        },
        take: 3,
        include: {
          brands: true,
          categories: true,
          creditCards: { include: { brand: true } },
          avantajlar: true,
        },
      })
    : [];

  const isExpired = new Date(campaign.endDate).getTime() < Date.now();
  const daysLeft = isExpired ? 0 : Math.ceil((new Date(campaign.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <Header />

      <main className="flex-1 relative z-10">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-widest">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-slate-500">Kampanya</span>
              <span>/</span>
              <span className="text-indigo-600 truncate max-w-[400px]">{campaign.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ===== MAIN CONTENT ===== */}
            <div className="lg:col-span-8 space-y-6">
              {/* Campaign card */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                {/* Image */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  {campaign.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center">
                      <span className="text-6xl opacity-30">🎯</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Category tags */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {campaign.categories.map(cat => (
                      <Link key={cat.id} href={`/sektorler/${cat.slug}`}
                        className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/60 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                      >
                        {cat.icon} {cat.name}
                      </Link>
                    ))}
                  </div>

                  {/* Days/Status badge */}
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1.5 rounded-full text-[11px] font-black backdrop-blur-sm shadow-sm border ${
                      isExpired
                        ? "bg-slate-800/90 text-white border-slate-700 hover:bg-slate-900"
                        : daysLeft <= 7 
                          ? "bg-red-50/90 text-red-600 border-red-200" 
                          : "bg-white/90 text-slate-700 border-white/60"
                    }`}>
                      {isExpired ? "Süresi Doldu" : daysLeft === 0 ? "⚡ Son gün!" : `${daysLeft} gün kaldı`}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Advantage tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {campaign.avantajlar.map(av => (
                      <Link key={av.id} href={`/avantajlar/${av.slug}`}
                        className="text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-violet-100 transition-colors"
                      >
                        {av.icon} {av.name}
                      </Link>
                    ))}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-6">
                    {campaign.title}
                  </h1>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Son Katılım</div>
                      <div className="font-black text-slate-800 text-sm">{new Date(campaign.endDate).toLocaleDateString("tr-TR")}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Favori</div>
                      <div className="font-black text-slate-800 text-sm">{campaign.favoritedBy.length} kişi</div>
                    </div>
                    <div className={isExpired ? "bg-red-50 border border-red-200 rounded-2xl p-4" : "bg-emerald-50 border border-emerald-200 rounded-2xl p-4"}>
                      <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isExpired ? "text-red-500" : "text-emerald-500"}`}>Durum</div>
                      <div className={`font-black text-sm flex items-center gap-1.5 ${isExpired ? "text-red-600" : "text-emerald-600"}`}>
                        {isExpired ? (
                          <>
                            <span className="text-[10px] bg-red-200/50 text-red-500 rounded-full w-4 h-4 flex items-center justify-center">✕</span>
                            Süresi Doldu
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                            Aktif
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {/* @ts-ignore */}
                  {campaign.summary && (
                    // @ts-ignore
                    <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-5 mb-6 text-indigo-900/80 font-medium text-[15px] leading-relaxed">
                      {/* @ts-ignore */}
                      {campaign.summary}
                    </div>
                  )}

                  {/* Summary */}
                  {/* @ts-ignore */}
                  {campaign.summary && (
                    <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-5 mb-6 text-indigo-900/80 font-medium text-[15px] leading-relaxed">
                      {/* @ts-ignore */}
                      {campaign.summary}
                    </div>
                  )}

                  {/* Description */}
                  <div
                    className="prose prose-slate max-w-none prose-a:text-indigo-600 prose-headings:text-slate-800 text-slate-600 leading-relaxed text-[15px]"
                    dangerouslySetInnerHTML={{ __html: campaign.description }}
                  ></div>

                  {/* Interactions */}
                  <div className="mt-8">
                    <InteractionClient
                      campaignId={campaign.id}
                      initialFavorited={isFavorited}
                      isLoggedIn={!!session?.user}
                    />
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-800">Yorumlar</h3>
                  <span className="bg-indigo-50 text-indigo-600 text-xs font-black px-3 py-1 rounded-full border border-indigo-100">
                    {campaign.comments.length} yorum
                  </span>
                </div>

                <div className="space-y-4">
                  {campaign.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-black flex-shrink-0 shadow-sm">
                        {comment.user.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-black text-slate-800 text-sm">{comment.user.name || "Kullanıcı"}</span>
                          <span className="text-slate-400 text-xs">{new Date(comment.createdAt).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                  {campaign.comments.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <div className="text-4xl mb-3">💬</div>
                      <p className="font-semibold">Henüz yorum yapılmamış.</p>
                      <p className="text-sm mt-1">İlk yorumu siz yapın!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ===== SIDEBAR ===== */}
            <div className="lg:col-span-4 space-y-5">
              {/* CTA Buttons */}
              <div className="space-y-3">
                <button 
                  disabled={isExpired}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isExpired 
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed uppercase tracking-wider text-[11px]" 
                      : "btn-primary text-white"
                  }`}
                >
                  {isExpired ? "⛔ Kampanya Sona Erdi" : "🎯 Kampanyaya Katıl"}
                </button>
                <button className="w-full btn-outline py-4 rounded-2xl font-bold text-sm">
                  Arkadaşınla Paylaş
                </button>
              </div>

              {/* Brands */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Markalar</h4>
                <div className="space-y-3">
                  {campaign.brands.map(brand => (
                    <Link key={brand.id} href={`/markalar/${brand.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1.5 shadow-sm flex-shrink-0">
                        {brand.logoUrl ? (
                          <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white text-xs font-black">
                            {brand.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors text-sm">{brand.name}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">Resmi Ortak</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Valid Cards */}
              {campaign.creditCards.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Geçerli Kartlar</h4>
                  <div className="flex flex-wrap gap-2">
                    {campaign.creditCards.map(card => (
                      <div key={card.id} className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full">
                        <span className="text-[10px]">💳</span>
                        <span className="text-indigo-700 text-xs font-black">{card.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Campaigns */}
              {relatedCampaigns.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Benzer Fırsatlar</h4>
                  <div className="space-y-4">
                    {relatedCampaigns.map(rc => (
                      <Link key={rc.id} href={`/kampanya/${rc.slug}`} className="flex gap-3 group">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 group-hover:shadow-sm transition-all">
                          {rc.imageUrl && (
                            <img src={rc.imageUrl} alt={rc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 font-bold text-xs group-hover:text-indigo-600 transition-colors line-clamp-2 leading-relaxed">
                            {rc.title}
                          </p>
                          <p className="text-slate-400 text-[10px] mt-1 font-semibold">
                            {rc.categories[0]?.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Campaigns Grid */}
          {relatedCampaigns.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-black text-slate-900 mb-8">
                Sektördeki <span className="highlight-gradient">Diğer Fırsatlar</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCampaigns.map((rc, i) => (
                  <CampaignCard key={rc.id} campaign={rc} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
