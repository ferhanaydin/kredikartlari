import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import InteractionClient from "./InteractionClient";

const prisma = new PrismaClient();

export default async function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const session = await auth();
  
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug },
    include: {
      bank: true,
      category: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      },
      favoritedBy: true
    }
  });

  if (!campaign) {
    notFound();
  }

  // Check if current user favorited it
  const isFavorited = session?.user?.email 
    ? campaign.favoritedBy.some(fav => fav.user?.email === session.user?.email) // we would need to fetch user id normally, but this is a simplified check
    : false;

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col">
      <div className="background-blob blob-1"></div>
      
      <header className="navbar py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-[28px]">💳</span>
            <span>KrediKartlari<span className="text-[#00f2fe]">.net</span></span>
          </Link>
          <div className="flex gap-4">
             <Link href="/" className="text-slate-300 hover:text-white transition-colors">Ana Sayfa</Link>
             {session?.user ? (
               <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Hesabım</Link>
             ) : (
               <Link href="/login" className="btn-outline px-4 py-2 rounded-lg text-sm">Giriş Yap</Link>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full relative z-10">
        <article className="bg-[#191c29]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
           <div className="h-[300px] w-full bg-slate-800 relative">
              {campaign.imageUrl && (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#191c29] to-transparent"></div>
              <div className="absolute bottom-6 left-6 flex gap-3">
                 <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{campaign.bank.name}</span>
                 <span className="bg-[#00f2fe] text-black px-3 py-1 rounded-full text-sm font-semibold">{campaign.category.name}</span>
              </div>
           </div>

           <div className="p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{campaign.title}</h1>
              <div className="flex items-center gap-4 text-slate-400 text-sm mb-8 border-b border-white/10 pb-6">
                 <span>⏳ Son Geçerlilik: <strong className="text-white">{campaign.endDate.toLocaleDateString('tr-TR')}</strong></span>
                 <span>❤️ {campaign.favoritedBy.length} kişi favoriledi</span>
              </div>
              
              <div className="prose prose-invert max-w-none mb-12 text-slate-300 leading-relaxed text-lg">
                 {campaign.description}
              </div>

              {/* Interaction Component (Client-Side) */}
              <InteractionClient 
                 campaignId={campaign.id} 
                 initialFavorited={isFavorited} 
                 isLoggedIn={!!session?.user} 
              />
           </div>
        </article>

        {/* Yorumlar Bölümü */}
        <section className="mt-12">
           <h3 className="text-2xl font-bold text-white mb-6">Yorumlar ({campaign.comments.length})</h3>
           
           <div className="space-y-6">
              {campaign.comments.map(comment => (
                 <div key={comment.id} className="bg-[#191c29]/40 backdrop-blur-md rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#00f2fe] flex items-center justify-center text-white font-bold">
                          {comment.user.name?.charAt(0) || "U"}
                       </div>
                       <div>
                          <h4 className="text-white font-medium">{comment.user.name || "İsimsiz Kullanıcı"}</h4>
                          <span className="text-xs text-slate-500">{comment.createdAt.toLocaleDateString()}</span>
                       </div>
                    </div>
                    <p className="text-slate-300 ml-13">{comment.text}</p>
                 </div>
              ))}
              
              {campaign.comments.length === 0 && (
                 <p className="text-slate-500 italic">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
              )}
           </div>
        </section>
      </main>
    </div>
  );
}
