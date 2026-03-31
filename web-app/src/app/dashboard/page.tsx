import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

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
    <div className="min-h-screen bg-transparent relative flex flex-col">
      <div className="background-blob blob-1"></div>
      <div className="background-blob blob-2" style={{ animationDelay: "-3s" }}></div>

      <header className="navbar py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-[28px]">💳</span>
            <span>KrediKartlari<span className="text-[#00f2fe]">.net</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Merhaba, <span className="text-white font-semibold">{user.name || user.email}</span></span>
            {user.role === "ADMIN" && (
              <Link href="/admin" className="bg-[#7c3aed] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-[#7c3aed]/30 hover:bg-[#6d28d9] transition-all">
                Yönetim Paneli
              </Link>
            )}
            {/* TODO: Kendi profilinden Çıkış İşlemi için form/next-auth route buton eklenebilir */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full relative z-10 space-y-12">
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">Favori Kampanyalarım 💖</h2>
          {user.favorites.length === 0 ? (
             <div className="bg-[#191c29]/60 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
                <p className="text-slate-400 mb-4">Henüz favori kampanyan bulunmuyor.</p>
                <Link href="/" className="btn-primary w-fit px-6 py-2 rounded-lg text-sm inline-block">Kampanyaları Keşfet</Link>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.favorites.map((fav) => (
                <div key={fav.id} className="bg-[#191c29]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-4">
                   <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                      {fav.campaign.imageUrl ? (
                         // eslint-disable-next-line @next/next/no-img-element
                        <img src={fav.campaign.imageUrl} alt={fav.campaign.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500">Foto Yok</div>
                      )}
                   </div>
                   <div className="flex flex-col">
                      <h3 className="text-white font-medium text-sm line-clamp-2">{fav.campaign.title}</h3>
                      <Link href={`/kampanya/${fav.campaign.slug}`} className="text-[#00f2fe] text-xs font-semibold mt-auto hover:underline">Detaya Git</Link>
                   </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-white">Gönderdiğim Öneriler 🚀</h2>
            <Link href="/kampanya-oner" className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors">
              ➕ Yeni Kampanya Öner
            </Link>
          </div>
          
          {user.campaigns.length === 0 ? (
             <div className="bg-[#191c29]/60 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
                <p className="text-slate-400">Henüz bize önerdiğiniz bir kampanya bulunmuyor.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {user.campaigns.map((camp) => (
                <div key={camp.id} className="bg-[#191c29]/60 backdrop-blur-md rounded-xl p-4 border border-white/10 flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">{camp.title}</h3>
                    <p className="text-slate-400 text-xs mt-1">Durumu: <span className={camp.status === 'PUBLISHED' ? "text-green-400" : camp.status === 'REJECTED' ? "text-red-400" : "text-yellow-400"}>{camp.status}</span></p>
                  </div>
                  <span className="text-slate-500 text-xs">{camp.createdAt.toLocaleDateString('tr-TR')}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
