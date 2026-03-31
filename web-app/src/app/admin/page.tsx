import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await auth();

  // @ts-ignore
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Bekleyen kampanyaları ve sistemdeki banka/kategorileri çek
  const pendingCampaigns = await prisma.campaign.findMany({
    where: { status: "PENDING" },
    include: { author: true, bank: true, category: true },
    orderBy: { createdAt: "desc" }
  });

  const banks = await prisma.bank.findMany();
  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col">
      <div className="background-blob blob-1"></div>
      
      <header className="navbar py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-[28px]">🛡️</span>
            <span>Admin<span className="text-[#7c3aed]">Panel</span></span>
          </Link>
          <div className="flex gap-4">
             <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Kullanıcı Panelim</Link>
             <Link href="/" className="text-slate-300 hover:text-white transition-colors">Siteye Dön</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sol Kolon - Yeni Kampanya Ekleme */}
        <section className="lg:col-span-1 bg-[#191c29]/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl h-fit">
           <h2 className="text-2xl font-bold text-white mb-6">Yeni Kampanya Ekle</h2>
           {/* Not: Bu form normalde "use client" componenti olmalı, basitlik adına UI taslağı olarak bırakıyoruz. API'ye bağlanacak. */}
           <form action="/api/admin/campaigns" method="POST" className="space-y-4">
              <div>
                 <label className="text-sm text-slate-300">Kampanya Başlığı</label>
                 <input type="text" name="title" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mt-1" />
              </div>
              <div>
                 <label className="text-sm text-slate-300">Açıklama</label>
                 <textarea name="description" required rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mt-1"></textarea>
              </div>
              <div>
                 <label className="text-sm text-slate-300">Görsel URL (İsteğe bağlı)</label>
                 <input type="url" name="imageUrl" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm text-slate-300">Banka</label>
                    <select name="bankId" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mt-1 outline-none">
                       {banks.map(b => <option key={b.id} value={b.id} className="text-black">{b.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-sm text-slate-300">Kategori</label>
                    <select name="categoryId" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mt-1 outline-none">
                       {categories.map(c => <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
                    </select>
                 </div>
              </div>
              <div>
                 <label className="text-sm text-slate-300">Bitiş Tarihi</label>
                 <input type="date" name="endDate" required className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mt-1" />
              </div>
              <div>
                 <label className="text-sm text-slate-300">SEO URL (Slug)</label>
                 <input type="text" name="slug" required placeholder="ornek-kampanya-123" className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white mt-1" />
              </div>
              
              <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors mt-4">
                 Kampanyayı Doğrudan Yayınla
              </button>
           </form>
        </section>

        {/* Sağ Kolon - Bekleyen Onaylar */}
        <section className="lg:col-span-2">
           <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4">Onay Bekleyen Kampanyalar ⏳</h2>
           
           {pendingCampaigns.length === 0 ? (
              <div className="bg-[#191c29]/60 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center text-slate-400">
                 Şu anda onay bekleyen üye önerisi bulunmuyor. Her şey güncel!
              </div>
           ) : (
              <div className="space-y-4">
                 {pendingCampaigns.map(camp => (
                    <div key={camp.id} className="bg-[#191c29]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                       <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                             <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded border border-purple-500/30">{camp.bank.name}</span>
                             <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30">{camp.category.name}</span>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">{camp.title}</h3>
                          <p className="text-slate-400 text-sm mb-4 line-clamp-2">{camp.description}</p>
                          <div className="text-xs text-slate-500">
                             Öneren: <span className="text-slate-300">{camp.author?.name || camp.author?.email || "Bilinmiyor"}</span> •
                             Tarih: {camp.createdAt.toLocaleDateString('tr-TR')}
                          </div>
                       </div>
                       
                       <div className="flex md:flex-col gap-3 justify-center">
                          {/* İlgili API endpointleri yazıldığında bu butonlar çalışacaktır */}
                          <form action="/api/admin/approve" method="POST">
                             <input type="hidden" name="id" value={camp.id} />
                             <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 px-4 py-2 rounded-lg font-medium transition-colors">Onayla ve Yayınla</button>
                          </form>
                          <form action="/api/admin/reject" method="POST">
                             <input type="hidden" name="id" value={camp.id} />
                             <button className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg font-medium transition-colors">Reddet ve Sil</button>
                          </form>
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
