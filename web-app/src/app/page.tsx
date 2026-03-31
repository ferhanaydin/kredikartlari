"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock Data
const MOCK_CAMPAIGNS = [
  {
    id: 1,
    title: "Market Alışverişlerinize 500 TL'ye Varan Bonus!",
    desc: "Garanti BBVA kredi kartınızla anlaşmalı marketlerden yapacağınız her 1000 TL ve üzeri alışverişe 50 TL, toplamda 500 TL Bonus.",
    category: "market",
    categoryName: "🛒 Market",
    bank: "garanti",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Garanti_BBVA_logo.svg/512px-Garanti_BBVA_logo.svg.png",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
    endDate: "30 Mayıs 2026",
  },
  {
    id: 2,
    title: "Akaryakıtta %5 MaxiPuan Fırsatı",
    desc: "İş Bankası Maximum Kart ile anlaşmalı istasyonlardan yapacağınız akaryakıt alımlarında anında %5 MaxiPuan kazanın.",
    category: "akaryakit",
    categoryName: "⛽ Akaryakıt",
    bank: "isbankasi",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Isbank_logo.svg/512px-Isbank_logo.svg.png",
    image: "https://images.unsplash.com/photo-1541884053360-e41c45df16a7?auto=format&fit=crop&q=80&w=600",
    endDate: "15 Haziran 2026",
  },
  {
    id: 3,
    title: "Giyim Harcamalarınıza Ekstra +3 Taksit",
    desc: "Worldcard ile yapacağınız tüm giyim ve aksesuar harcamalarında peşin fiyatına +3 taksit fırsatını kaçırmayın.",
    category: "giyim",
    categoryName: "👗 Giyim",
    bank: "ykb",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Yap%C4%B1_Kredi_logo.svg/512px-Yap%C4%B1_Kredi_logo.svg.png",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=600",
    endDate: "10 Mayıs 2026",
  },
  {
    id: 4,
    title: "Miles&Smiles ile Uçak Biletlerinde Çift Mil",
    desc: "THY ve Star Alliance uçuşlarında kullanacağınız Miles&Smiles kredi kartınızla bilet alımlarınızda çift mil kazanın.",
    category: "seyahat",
    categoryName: "✈️ Seyahat",
    bank: "garanti",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Garanti_BBVA_logo.svg/512px-Garanti_BBVA_logo.svg.png",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600",
    endDate: "31 Aralık 2026",
  },
  {
    id: 5,
    title: "Elektronik Alışverişinize 1000 TL Chip-Para",
    desc: "Akbank Axess kartınızla teknoloji marketlerinden yapacağınız 15.000 TL üzeri ilk alışverişe anında 1000 TL chip-para.",
    category: "elektronik",
    categoryName: "💻 Elektronik",
    bank: "akbank",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Akbank_logo.svg/512px-Akbank_logo.svg.png",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600",
    endDate: "20 Haziran 2026",
  },
  {
    id: 6,
    title: "CardFinans ile Tatil Harcamalarına Yüzde 10 İndirim",
    desc: "Seçili turizm acentelerinde QNB Finansbank CardFinans kredi kartı ile yapacağınız rezervasyonlara anında %10 indirim.",
    category: "seyahat",
    categoryName: "✈️ Seyahat",
    bank: "qnb",
    bankLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/QNB_Finansbank_logo.svg/512px-QNB_Finansbank_logo.svg.png",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600",
    endDate: "31 Ağustos 2026",
  }
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBank, setActiveBank] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchBank = activeBank === 'all' || item.bank === activeBank;
      const term = searchQuery.toLowerCase();
      const matchSearch = item.title.toLowerCase().includes(term) || 
                          item.desc.toLowerCase().includes(term) ||
                          item.bank.toLowerCase().includes(term);
      return matchCategory && matchBank && matchSearch;
    });
  }, [activeCategory, activeBank, searchQuery]);

  return (
    <>
      <div className="background-blob blob-1"></div>
      <div className="background-blob blob-2"></div>
      
      <header className="navbar py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-[28px]">💳</span>
            <span>KrediKartlari<span className="text-[#00f2fe]">.net</span></span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="active text-white font-medium relative hover:text-white transition-colors">Kampanyalar</Link>
            <Link href="#" className="text-slate-400 font-medium hover:text-white transition-colors">Bankalar</Link>
            <Link href="#" className="text-slate-400 font-medium hover:text-white transition-colors">Kredi Kartları</Link>
            <Link href="#" className="text-slate-400 font-medium hover:text-white transition-colors">İletişim</Link>
          </nav>
          <div className="flex items-center">
            <button className="btn-outline px-6 py-2.5 rounded-lg font-semibold text-[15px] flex items-center justify-center gap-2">Giriş Yap</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <section className="text-center pt-20 pb-16 flex flex-col items-center gap-6">
          <div className="bg-[#7c3aed26] border border-[#7c3aed4d] text-purple-300 px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center">
            ✨ Yeni Kampanyalar Eklendi
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-[800px] leading-tight">
            Avantajı Yakala, <br/><span className="highlight-gradient">Harcarken Kazan!</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-[600px] mx-auto">
            Türkiye'nin en güncel kredi kartı kampanyaları tek ekranda. Bankaların sunduğu fırsatları karşılaştırın, bütçenizi en iyi şekilde yönetin.
          </p>
          
          <div className="search-box flex w-full max-w-[600px] rounded-2xl p-2 mt-6">
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none text-white px-4 outline-none placeholder-slate-500" 
              placeholder="Kampanya, marka veya banka ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-primary p-3 rounded-xl flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
        </section>

        <section className="py-6 pb-10 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
          <div className="filter-group flex gap-3 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'market', label: '🛒 Market' },
              { id: 'akaryakit', label: '⛽ Akaryakıt' },
              { id: 'giyim', label: '👗 Giyim' },
              { id: 'seyahat', label: '✈️ Seyahat' },
              { id: 'elektronik', label: '💻 Elektronik' },
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`filter-btn px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap ${activeCategory === cat.id ? 'active' : 'text-slate-400'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          <div className="flex">
            <select 
              className="bank-select text-white px-5 py-3 rounded-lg cursor-pointer outline-none pl-4 pr-10 w-full md:w-auto"
              value={activeBank}
              onChange={(e) => setActiveBank(e.target.value)}
            >
              <option value="all">Tüm Bankalar</option>
              <option value="garanti">Garanti BBVA</option>
              <option value="isbankasi">İş Bankası</option>
              <option value="ykb">Yapı Kredi</option>
              <option value="akbank">Akbank</option>
              <option value="qnb">QNB Finansbank</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filteredCampaigns.length === 0 ? (
            <div className="col-span-full text-center p-10 text-slate-400">
              Aradığınız kriterlere uygun kampanya bulunamadı.
            </div>
          ) : (
            filteredCampaigns.map((campaign, i) => (
              <article 
                key={campaign.id} 
                className="campaign-card rounded-2xl overflow-hidden flex flex-col relative cursor-pointer"
                style={{
                  animation: `fadeInUp 0.5s ease forwards ${i * 0.1}s`,
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                <div className="relative h-[180px] overflow-hidden bg-[#1e2136]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={campaign.image} alt={campaign.title} className="card-img w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white border border-white/10">
                    {campaign.categoryName}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={campaign.bankLogo} alt="Banka" className="absolute -bottom-4 right-4 w-12 h-12 rounded-xl bg-white p-2 shadow-lg border-2 border-[#0f111a] object-contain" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2">{campaign.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{campaign.desc}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
                      <svg className="text-purple-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      Son: {campaign.endDate}
                    </div>
                    <span className="text-[#00f2fe] font-semibold text-sm flex items-center gap-1 hover:text-white transition-colors">
                      Detay 
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
        
        <div className="flex justify-center mb-20">
          <button className="btn-outline px-6 py-2.5 rounded-lg font-semibold text-white">Daha Fazla Göster</button>
        </div>
      </main>

      <footer className="border-t border-white/10 pt-16 pb-10 bg-[#0f111a]/80">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
              <span>KrediKartlari<span className="text-[#00f2fe]">.net</span></span>
            </Link>
            <p className="text-slate-400 max-w-[300px]">
              En güncel kart fırsatları ve indirimler için bizi takip edin. Tüm hakları saklıdır &copy; 2026
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Hızlı Linkler</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">Ana Sayfa</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">Kampanyalar</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">Bankalar</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">Hakkımızda</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white">Yasal</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">Kullanım Koşulları</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">Çerez Politikası</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-[#00f2fe] transition-colors">İletişim</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
