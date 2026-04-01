import { PrismaClient } from "@prisma/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = await prisma.category.findUnique({ where: { slug } });
  if (!sector) return { title: "Sektör Bulunamadı" };
  return {
    title: `${sector.name} Kampanyaları | KrediKartlari.net`,
    description: `${sector.name} kategorisindeki tüm kredi kartı kampanyaları.`,
  };
}

export default async function SectorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const sector = await prisma.category.findUnique({
    where: { slug },
    include: {
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

  if (!sector) return <div className="p-20 text-center text-slate-500">Sektör bulunamadı.</div>;

  const otherSectors = await prisma.category.findMany({
    where: { id: { not: sector.id } },
    take: 6,
    orderBy: { name: "asc" },
    include: { _count: { select: { campaigns: true } } },
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
              <Link href="/sektorler" className="hover:text-indigo-600 transition-colors">Sektörler</Link>
              <span>/</span>
              <span className="text-indigo-600">{sector.name}</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-4xl shadow-sm border border-indigo-100">
                  {sector.icon || "🏷️"}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                    {sector.name} <span className="text-slate-300 font-light">Kampanyaları</span>
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    {sector.campaigns.length} aktif fırsat listeleniyor
                  </p>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl flex-shrink-0">
                <span className="text-indigo-700 font-black text-2xl">{sector.campaigns.length}</span>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest ml-2">Kampanya</span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Campaigns */}
          {sector.campaigns.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-bold">Bu sektörde henüz kampanya yok.</p>
              <Link href="/sektorler" className="mt-4 text-indigo-600 font-bold hover:underline inline-block">
                Diğer sektörlere bak →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {sector.campaigns.map((camp, i) => (
                <CampaignCard key={camp.id} campaign={camp} index={i} />
              ))}
            </div>
          )}

          {/* Other Sectors */}
          {otherSectors.length > 0 && (
            <div className="border-t border-slate-200 pt-12">
              <h2 className="text-xl font-black text-slate-800 mb-6">
                Diğer <span className="highlight-gradient">Sektörler</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {otherSectors.map((s) => (
                  <Link
                    key={s.id}
                    href={`/sektorler/${s.slug}`}
                    className="group bg-white border border-slate-200 p-4 rounded-xl hover:border-indigo-300 hover:shadow-sm hover:-translate-y-0.5 transition-all text-center"
                  >
                    <div className="text-2xl mb-2">{s.icon || "🏷️"}</div>
                    <div className="text-slate-700 font-bold text-xs group-hover:text-indigo-600 transition-colors">{s.name}</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">{s._count.campaigns} kampanya</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
