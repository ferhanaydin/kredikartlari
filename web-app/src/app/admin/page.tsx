import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import CampaignForm from "./CampaignForm";

const prisma = new PrismaClient();

export const metadata = {
  title: "Admin Panel | KrediKartlari.net",
};

export default async function AdminPage() {
  const session = await auth();

  // @ts-ignore
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [pendingCampaigns, categories, brands, creditCards, avantajlar, pendingEditors, stats] = await Promise.all([
    prisma.campaign.findMany({
      where: { status: "PENDING" },
      include: { author: true, brands: true, categories: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, include: { category: true } }),
    prisma.creditCard.findMany({ orderBy: { name: "asc" }, include: { brand: true } }),
    prisma.avantaj.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({
      // @ts-ignore
      where: { role: "FIRMA_EDITOR", isApproved: false },
      // @ts-ignore
      include: { brand: true },
      orderBy: { createdAt: "desc" },
    }),
    Promise.all([
      prisma.campaign.count({ where: { status: "PUBLISHED" } }),
      prisma.campaign.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
      prisma.brand.count(),
    ]),
  ]);

  const [publishedCount, pendingCount, userCount, brandCount] = stats;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>

      {/* ===== Admin Header ===== */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800">📊 Genel Bakış</h1>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">Hoş geldiniz, {/* @ts-ignore */}{session.user.name || session.user.email}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/markalar/yeni" className="btn-primary px-4 py-2 rounded-xl text-xs font-black text-white">+ Marka</Link>
          <Link href="/admin/sektorler/yeni" className="btn-outline px-4 py-2 rounded-xl text-xs font-black">+ Sektör</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">

        {/* ===== STATS ROW ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Yayındaki Kampanya", value: publishedCount, icon: "🎯", color: "from-indigo-500 to-violet-500", light: "indigo" },
            { label: "Onay Bekleyen", value: pendingCount, icon: "⏳", color: "from-amber-500 to-orange-500", light: "amber" },
            { label: "Kayıtlı Kullanıcı", value: userCount, icon: "👥", color: "from-emerald-500 to-teal-500", light: "emerald" },
            { label: "Aktif Marka", value: brandCount, icon: "🏢", color: "from-sky-500 to-blue-500", light: "sky" },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              style={{ animation: "fadeInUp 0.4s ease forwards", opacity: 0 }}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-slate-800">{stat.value}</div>
              <div className="text-slate-500 text-sm font-semibold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Alert for pending items */}
        {(pendingCount > 0 || pendingEditors.length > 0) && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <p className="text-amber-800 font-black text-sm">Dikkat Gerektiren İşlemler</p>
              <p className="text-amber-600 text-xs mt-0.5">
                {pendingCount > 0 && `${pendingCount} kampanya onayı bekliyor. `}
                {pendingEditors.length > 0 && `${pendingEditors.length} editör başvurusu bekliyor.`}
              </p>
            </div>
          </div>
        )}

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ---- NEW CAMPAIGN FORM ---- */}
          <section className="lg:col-span-8">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-6">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  ✨ Yeni Kampanya Ekle
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Yeni kampanyayı anında yayınlayın.</p>
              </div>
              <div className="p-6">
                <CampaignForm
                  categories={categories}
                  brands={brands}
                  creditCards={creditCards}
                  avantajlar={avantajlar}
                />
              </div>
            </div>
          </section>

          {/* ---- RIGHT COLUMN ---- */}
          <section className="lg:col-span-4 space-y-8">

            {/* Editor Approvals */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl">👤</div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800">Editör Başvuruları</h2>
                    <p className="text-slate-400 text-xs font-semibold">Firma editörü onayları</p>
                  </div>
                </div>
                {pendingEditors.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
                    {pendingEditors.length} Bekleyen
                  </span>
                )}
              </div>

              <div className="p-6">
                {pendingEditors.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-slate-500 text-sm font-semibold">Bekleyen başvuru yok</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pendingEditors.map((editor: any) => (
                      <div key={editor.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:border-indigo-200 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                              {editor.name?.[0] || "?"}
                            </div>
                            <div>
                              <p className="text-slate-800 font-black text-sm">{editor.name}</p>
                              <p className="text-slate-400 text-xs">{editor.email}</p>
                            </div>
                          </div>
                          <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-100 flex-shrink-0 ml-2">
                            {editor.brand?.name || "Bilinmiyor"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <form action="/api/admin/users" method="POST" className="flex-1">
                            <input type="hidden" name="userId" value={editor.id} />
                            <input type="hidden" name="action" value="approve" />
                            <button className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-2 rounded-xl text-xs font-black transition-colors">
                              ✓ Onayla
                            </button>
                          </form>
                          <form action="/api/admin/users" method="POST" className="flex-1">
                            <input type="hidden" name="userId" value={editor.id} />
                            <input type="hidden" name="action" value="reject" />
                            <button className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-xl text-xs font-black transition-colors">
                              ✗ Reddet
                            </button>
                          </form>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Approvals */}
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl">🎯</div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800">Kampanya Onayları</h2>
                    <p className="text-slate-400 text-xs font-semibold">Kullanıcı tarafından önerilen kampanyalar</p>
                  </div>
                </div>
                {pendingCampaigns.length > 0 && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full border border-amber-200">
                    {pendingCampaigns.length} Bekleyen
                  </span>
                )}
              </div>

              <div className="p-6">
                {pendingCampaigns.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-slate-500 text-sm font-semibold">Tüm kampanyalar işlendi</p>
                    <p className="text-slate-400 text-xs mt-1">Onay bekleyen kampanya önerisi yok.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCampaigns.map((camp: any) => (
                      <div key={camp.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {camp.brands.map((b: any) => (
                            <span key={b.id} className="bg-violet-50 text-violet-700 text-[10px] px-2.5 py-1 rounded-full font-black border border-violet-100 uppercase tracking-wide">
                              {b.name}
                            </span>
                          ))}
                          {camp.categories.map((c: any) => (
                            <span key={c.id} className="bg-indigo-50 text-indigo-700 text-[10px] px-2.5 py-1 rounded-full font-black border border-indigo-100 uppercase tracking-wide">
                              {c.icon} {c.name}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-base font-black text-slate-800 mb-1">{camp.title}</h3>
                        <p className="text-slate-500 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {camp.description.replace(/<[^>]*>/g, "").substring(0, 150)}
                        </p>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                          <div className="text-xs text-slate-400 font-semibold">
                            <span className="text-slate-600 font-black">{camp.author?.name || camp.author?.email || "Bilinmiyor"}</span> tarafından önerildi ·{" "}
                            {new Date(camp.createdAt).toLocaleDateString("tr-TR")}
                          </div>

                          <div className="flex gap-2 flex-shrink-0">
                            <form action="/api/admin/approve" method="POST">
                              <input type="hidden" name="id" value={camp.id} />
                              <button className="bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-700 border border-emerald-200 hover:border-emerald-500 px-4 py-2 rounded-xl text-xs font-black transition-all">
                                ✓ Onayla
                              </button>
                            </form>
                            <form action="/api/admin/reject" method="POST">
                              <input type="hidden" name="id" value={camp.id} />
                              <button className="bg-red-50 hover:bg-red-500 hover:text-white text-red-600 border border-red-200 hover:border-red-500 px-4 py-2 rounded-xl text-xs font-black transition-all">
                                ✗ Reddet
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
