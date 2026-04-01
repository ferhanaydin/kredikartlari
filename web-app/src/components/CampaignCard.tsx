"use client";

import Link from "next/link";

interface Props {
  campaign: any;
  index: number;
}

// Category color map
const catColors: Record<string, { pill: string; dot: string }> = {
  "market":      { pill: "bg-amber-50 text-amber-700 border-amber-200",     dot: "bg-amber-400" },
  "akaryakit":   { pill: "bg-blue-50 text-blue-700 border-blue-200",        dot: "bg-blue-400" },
  "elektronik":  { pill: "bg-violet-50 text-violet-700 border-violet-200",  dot: "bg-violet-400" },
  "yemek":       { pill: "bg-rose-50 text-rose-700 border-rose-200",        dot: "bg-rose-400" },
  "seyahat":     { pill: "bg-sky-50 text-sky-700 border-sky-200",           dot: "bg-sky-400" },
  "default":     { pill: "bg-indigo-50 text-indigo-700 border-indigo-200",  dot: "bg-indigo-400" },
};

function isNew(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
}

function daysLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function CampaignCard({ campaign, index }: Props) {
  const primaryCat = campaign.categories?.[0];
  const colors = catColors[primaryCat?.slug] || catColors["default"];
  const days = daysLeft(campaign.endDate);
  const fresh = isNew(campaign.createdAt);

  return (
    <article
      className="campaign-card rounded-2xl overflow-hidden flex flex-col group"
      style={{
        animation: `fadeInUp 0.5s ease forwards ${index * 0.07}s`,
        opacity: 0,
        transform: "translateY(20px)",
      }}
    >
      <Link href={`/kampanya/${campaign.slug}`} className="absolute inset-0 z-10" aria-label={campaign.title}></Link>

      {/* Image */}
      <div className="relative h-[192px] overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={campaign.imageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600"}
          alt={campaign.title}
          className="card-img w-full h-full object-cover"
        />
        {/* Subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>

        {/* Top-left: Category + New badge */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-20 flex-wrap">
          {primaryCat && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${colors.pill}`}>
              {primaryCat.icon} {primaryCat.name}
            </span>
          )}
          {fresh && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
              🔥 Yeni
            </span>
          )}
        </div>

        {/* Top-right: Days left */}
        <div className="absolute top-3 right-3 z-20">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-black backdrop-blur-sm border ${days <= 7 ? "bg-red-50/90 text-red-600 border-red-200" : "bg-white/90 text-slate-600 border-white/50"}`}>
            {days === 0 ? "Son gün!" : `${days} gün`}
          </div>
        </div>

        {/* Brand logos floating at bottom */}
        <div className="absolute -bottom-4 left-4 flex -space-x-2 z-20">
          {campaign.brands.slice(0, 3).map((brand: any) => (
            <div key={brand.id} className="w-10 h-10 rounded-xl bg-white shadow-md border-2 border-white overflow-hidden flex items-center justify-center p-1 transition-transform group-hover:scale-105">
              {brand.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[9px] font-black">
                  {brand.name.substring(0, 2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-8 flex flex-col flex-1">
        {/* Credit card chips */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {campaign.creditCards?.slice(0, 3).map((card: any) => (
            <Link 
              href={`/markalar/${card.brand?.slug}/${card.slug}`} 
              key={card.id} 
              className="relative z-20 text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 flex items-center justify-center py-0.5 rounded-md uppercase tracking-wider border border-indigo-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors cursor-pointer"
            >
              {card.name}
            </Link>
          ))}
        </div>

        <h3 className="text-[15px] font-black text-slate-800 line-clamp-2 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
          {campaign.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
          {campaign.description.replace(/<[^>]*>/g, "").substring(0, 120)}
        </p>

        {/* Card footer */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
            <svg className="text-indigo-300 flex-shrink-0" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Son: {new Date(campaign.endDate).toLocaleDateString("tr-TR")}
          </div>

          <div className="flex items-center gap-1 text-indigo-600 font-black text-xs bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
            Detay
            <svg className="group-hover:translate-x-0.5 transition-transform" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
}
