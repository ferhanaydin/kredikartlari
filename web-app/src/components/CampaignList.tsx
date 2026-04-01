"use client";

import { useState, useMemo } from "react";
import CampaignCard from "./CampaignCard";

interface Props {
  initialCampaigns: any[];
  categories: any[];
  brands: any[];
  avantajlar: any[];
}

export default function CampaignList({ initialCampaigns, categories, brands, avantajlar }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeAvantaj, setActiveAvantaj] = useState("all");
  const [activeBrand, setActiveBrand] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = useMemo(() => {
    return initialCampaigns.filter((item) => {
      const matchCategory =
        activeCategory === "all" ||
        item.categories.some((c: any) => c.id === activeCategory);
      const matchAvantaj =
        activeAvantaj === "all" ||
        item.avantajlar.some((a: any) => a.id === activeAvantaj);
      const matchBrand =
        activeBrand === "all" ||
        item.brands.some((b: any) => b.id === activeBrand);
      const term = searchQuery.toLowerCase();
      const matchSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.brands.some((b: any) => b.name.toLowerCase().includes(term));
      return matchCategory && matchAvantaj && matchBrand && matchSearch;
    });
  }, [initialCampaigns, activeCategory, activeAvantaj, activeBrand, searchQuery]);

  const uniqueBrands = brands.filter(
    (b, i, arr) => arr.findIndex((x) => x.id === b.id) === i
  );

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3730a3 0%, #6d28d9 45%, #0369a1 100%)" }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
        {/* Pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-8" style={{ animation: "fadeInUp 0.5s ease forwards", opacity: 0 }}>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse flex-shrink-0"></span>
              {initialCampaigns.length} Aktif Kampanya Yayında
            </div>

            {/* Headline — solid white for max contrast */}
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6"
              style={{ animation: "fadeInUp 0.55s ease forwards 0.08s", opacity: 0, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
              Avantajı Yakala,
              <br />
              <span className="text-white">Harcarken Kazan!</span>
            </h1>

            <p className="text-white/90 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium"
              style={{ animation: "fadeInUp 0.55s ease forwards 0.16s", opacity: 0, textShadow: "0 1px 8px rgba(0,0,0,0.2)" }}>
              Türkiye&apos;nin en güncel kredi kartı kampanyaları tek ekranda. Fırsatları karşılaştırın, bütçenizi en iyi şekilde yönetin.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-3 md:gap-5 mb-10 flex-wrap" style={{ animation: "fadeInUp 0.55s ease forwards 0.22s", opacity: 0 }}>
              {[
                { value: initialCampaigns.length.toString(), label: "Kampanya" },
                { value: uniqueBrands.length + "+", label: "Marka & Banka" },
                { value: categories.length.toString(), label: "Sektör" },
                { value: avantajlar.length.toString(), label: "Avantaj Türü" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl px-5 py-3 text-white text-center min-w-[90px]"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(12px)" }}>
                  <div className="text-2xl md:text-3xl font-black leading-none">{stat.value}</div>
                  <div className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Search box */}
            <div className="search-box flex items-center w-full max-w-2xl mx-auto rounded-2xl p-2 shadow-2xl"
              style={{ animation: "fadeInUp 0.55s ease forwards 0.28s", opacity: 0 }}>
              <svg className="text-slate-400 ml-3 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="flex-1 bg-transparent border-none text-slate-800 px-3 py-2.5 outline-none placeholder-slate-400 text-sm min-w-0"
                placeholder="Kampanya, marka veya banka ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors px-2 text-lg leading-none flex-shrink-0">✕</button>
              )}
              <button className="btn-primary px-5 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0">
                Ara
              </button>
            </div>
          </div>
        </div>

        {/* Wave connector */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
            <path d="M0 56L1440 56L1440 28C1200 56 900 0 720 18C540 36 240 2 0 28L0 56Z" fill="#f5f7ff" />
          </svg>
        </div>
      </section>

      {/* ===================== FILTERS & GRID ===================== */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Filters */}
        <section className="py-8 space-y-5">
          {/* Category pills */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Sektörler</h3>
            <div className="filter-group flex gap-2 overflow-x-auto pb-1.5">
              <button onClick={() => setActiveCategory("all")} className={`filter-btn px-5 py-2 rounded-full text-sm whitespace-nowrap ${activeCategory === "all" ? "active" : ""}`}>
                🏠 Tümü
              </button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`filter-btn px-5 py-2 rounded-full text-sm whitespace-nowrap ${activeCategory === cat.id ? "active" : ""}`}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Advantage type pills */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Avantaj Türü</h3>
            <div className="filter-group flex gap-2 overflow-x-auto pb-1.5">
              <button onClick={() => setActiveAvantaj("all")} className={`filter-btn px-5 py-2 rounded-full text-sm whitespace-nowrap ${activeAvantaj === "all" ? "active" : ""}`}>
                ✨ Tümü
              </button>
              {avantajlar.map((av) => (
                <button key={av.id} onClick={() => setActiveAvantaj(av.id)} className={`filter-btn px-5 py-2 rounded-full text-sm whitespace-nowrap ${activeAvantaj === av.id ? "active" : ""}`}>
                  {av.icon} {av.name}
                </button>
              ))}
            </div>
          </div>

          {/* Count + brand dropdown */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 pb-4 border-b border-slate-200">
            <p className="text-slate-500 text-sm">
              <span className="text-slate-800 font-black text-xl">{filteredCampaigns.length}</span>{" "}
              kampanya listeleniyor
            </p>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-slate-400 font-bold whitespace-nowrap hidden sm:block">Marka / Banka:</span>
              <select
                className="bank-select text-sm px-4 py-2.5 rounded-xl cursor-pointer w-full md:w-56"
                value={activeBrand}
                onChange={(e) => setActiveBrand(e.target.value)}
              >
                <option value="all">Tüm Markalar</option>
                {uniqueBrands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Campaign grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredCampaigns.length === 0 ? (
            <div className="col-span-full text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-600 text-lg font-bold mb-2">Sonuç bulunamadı</p>
              <p className="text-slate-400 text-sm mb-6">Arama kriterlerinizi değiştirmeyi deneyin.</p>
              <button
                onClick={() => { setActiveCategory("all"); setActiveBrand("all"); setActiveAvantaj("all"); setSearchQuery(""); }}
                className="text-indigo-600 font-bold hover:underline text-sm"
              >
                Tüm filtreleri temizle →
              </button>
            </div>
          ) : (
            filteredCampaigns.map((campaign, i) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={i} />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
