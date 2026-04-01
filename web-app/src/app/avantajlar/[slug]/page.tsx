import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import Link from "next/link";

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const avantaj = await prisma.avantaj.findUnique({ where: { slug }, select: { name: true } });
  if (!avantaj) return { title: "Avantaj Bulunamadı" };
  return {
    title: `${avantaj.name} Kampanyaları | KrediKartlari.net`,
    description: `${avantaj.name} avantajlı tüm kredi kartı kampanyaları.`,
  };
}

export default async function AvantajDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const avantaj = await prisma.avantaj.findUnique({
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

  if (!avantaj) notFound();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-3"></div>
      <Header />

      <main className="flex-1 relative z-10">
        {/* Page Header */}
        <section className="bg-white border-b border-slate-200 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold uppercase tracking-widest mb-6">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <Link href="/avantajlar" className="hover:text-indigo-600 transition-colors">Avantajlar</Link>
              <span>/</span>
              <span className="text-indigo-600">{avantaj!.name}</span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl shadow-sm">
                  {avantaj!.icon || "⭐"}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                    {avantaj!.name} <span className="text-slate-300 font-light">Fırsatları</span>
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Tüm bankalardan {avantaj!.name.toLowerCase()} kampanyaları
                  </p>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl flex-shrink-0">
                <span className="text-indigo-700 font-black text-2xl">{avantaj!.campaigns.length}</span>
                <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest ml-2">Fırsat</span>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-12 pb-20">
          {avantaj!.campaigns.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="text-5xl mb-4 ">🔍</div>
              <p className="text-slate-500 text-lg font-bold">Bu avantaja ait kampanya bulunamadı.</p>
              <Link href="/avantajlar" className="mt-4 text-indigo-600 font-bold hover:underline inline-block">
                Diğer avantajlara bak →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avantaj!.campaigns.map((camp, i) => (
                <CampaignCard key={camp.id} campaign={camp} index={i} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
