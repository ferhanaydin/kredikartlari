import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import Header from "@/components/Header";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  // Veritabanından kullanıcının tüm favori ve yorum verilerini id üzerinden çekeceğiz
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
    include: {
      favorites: {
        include: {
          campaign: true,
        },
      },
      comments: {
        include: {
          campaign: true,
        },
      },
      campaigns: true, // Kendi önerdiği kampanyalar
    },
  });

  if (!user) {
    return <div className="text-white">Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full relative z-10 space-y-12">
        
        {/* Favori Kampanyalarım */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              💖
            </div>
            <h2 className="text-2xl font-black text-slate-900 border-b-2 border-slate-200 pb-2 flex-1">
              Favori Kampanyalarım
            </h2>
          </div>

          {user.favorites.length === 0 ? (
             <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 border border-slate-200 text-center shadow-sm">
                <div className="text-4xl mb-4">⭐</div>
                <p className="text-slate-500 font-semibold mb-6">Henüz favori kampanyan bulunmuyor.</p>
                <Link href="/" className="btn-primary w-fit px-8 py-3 rounded-2xl font-bold inline-block shadow-sm">
                  Kampanyaları Keşfet
                </Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.favorites.map((fav) => (
                <div key={fav.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 hover:border-indigo-300 hover:shadow-md transition-all group">
                   <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                      {fav.campaign.imageUrl ? (
                        <img src={fav.campaign.imageUrl} alt={fav.campaign.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🎯</div>
                      )}
                      {/* Durum */}
                      {new Date(fav.campaign.endDate).getTime() < Date.now() && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-md">BİTTİ</span>
                        </div>
                      )}
                   </div>
                   <div className="flex flex-col py-1">
                      <h3 className="text-slate-800 font-bold text-sm leading-tight line-clamp-3 group-hover:text-indigo-600 transition-colors">
                        {fav.campaign.title}
                      </h3>
                      <Link href={`/kampanya/${fav.campaign.slug}`} className="text-indigo-600 active:text-indigo-700 text-xs font-black mt-auto uppercase tracking-wider">
                        Detaya Git ➔
                      </Link>
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gönderdiğim Öneriler */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              🚀
            </div>
            <div className="flex-1 flex justify-between items-center border-b-2 border-slate-200 pb-2">
              <h2 className="text-2xl font-black text-slate-900">
                Gönderdiğim Öneriler
              </h2>
              {/* Not: kampanya-oner sayfası yoksa /admin vs linklenebilir, şimdilik böyle kalabilir */}
              <Link href="/kampanya-oner" className="btn-outline px-4 py-2 rounded-xl text-xs font-black">
                ➕ Yeni Ekle
              </Link>
            </div>
          </div>
          
          {user.campaigns.length === 0 ? (
             <div className="bg-white/80 backdrop-blur-md rounded-3xl p-10 border border-slate-200 text-center shadow-sm">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-slate-500 font-semibold">Henüz bize önerdiğiniz bir kampanya bulunmuyor.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {user.campaigns.map((camp) => (
                <div key={camp.id} className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors">
                  <div>
                    <h3 className="text-slate-800 font-bold leading-tight mb-2 sm:mb-1">{camp.title}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-xs font-semibold text-slate-500">
                        Durumu: 
                        <span className={`ml-1 font-black px-2 py-0.5 rounded-full ${
                          camp.status === 'PUBLISHED' ? "bg-emerald-100 text-emerald-700" : 
                          camp.status === 'REJECTED' ? "bg-red-100 text-red-600" : 
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {camp.status === 'PUBLISHED' ? "YAYINDA" : camp.status === 'REJECTED' ? "REDDEDİLDİ" : "ONAY BEKLİYOR"}
                        </span>
                      </p>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></span>
                      <span className="text-slate-400 text-xs font-medium hidden sm:block">
                        {camp.createdAt.toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Düzenle Linki (isteğe bağlı) */}
                    <Link href={`/kampanya-duzenle/${camp.id}`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-4 py-2 rounded-xl text-xs font-black transition-colors w-full sm:w-auto text-center">
                      ✏️ Düzenle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
