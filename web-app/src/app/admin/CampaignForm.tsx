"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";
import Editor from "react-simple-wysiwyg";
import SlugGenerator from "@/components/admin/SlugGenerator";

interface Props {
  categories: any[];
  brands: any[];
  creditCards: any[];
  avantajlar: any[];
  campaign?: any; // For editing
}

const inputClass = "w-full border-2 border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-3 focus:ring-indigo-50 transition-all";
const labelClass = "block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5";

export default function CampaignForm({ categories, brands, creditCards, avantajlar, campaign }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState(campaign?.description || "");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        body: formData,
      });

      if (res.redirected) {
        router.push(res.url);
        return;
      }

      if (res.ok) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        const data = await res.json();
        setMessage(data.message || "Bir hata oluştu.");
      }
    } catch {
      setMessage("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <SlugGenerator sourceName="title" targetName="slug" />
      {campaign?.id && <input type="hidden" name="id" value={campaign.id} />}
      {/* Alerts */}
      {message && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-sm font-semibold flex items-start gap-2">
          <span>⚠️</span> {message}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3.5 rounded-xl text-sm font-semibold flex items-start gap-2">
          <span>✓</span> Kampanya başarıyla yayınlandı!
        </div>
      )}

      {/* Campaign Image Upload */}
      <div>
        <label className={labelClass}>Kampanya Görseli</label>
        <ImageUpload
          name="imageUrl"
          folder="campaigns"
          shape="rectangle"
          label="Kampanya Görseli Yükle"
          currentUrl={campaign?.imageUrl}
        />
      </div>

      <hr className="border-slate-100" />

      {/* Title */}
      <div>
        <label className={labelClass}>Kampanya Başlığı *</label>
        <input type="text" name="title" required defaultValue={campaign?.title} placeholder="örn. Market'te %25 cashback!" className={inputClass} />
      </div>

      {/* Summary */}
      <div>
        <label className={labelClass}>Özet (Kısa Açıklama)</label>
        <textarea name="summary" defaultValue={campaign?.summary} rows={2} placeholder="Kampanyanın kısaca özeti (isteğe bağlı)..." className={inputClass + " resize-none"}></textarea>
      </div>

      {/* Description (Rich Text) */}
      <div>
        <label className={labelClass}>Detaylı Açıklama (Paragraf, Kalın vs) *</label>
        <input type="hidden" name="description" value={descriptionHtml} />
        <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden focus-within:border-indigo-400 focus-within:ring-3 focus-within:ring-indigo-50 transition-all">
          {isMounted && (
            <Editor 
              value={descriptionHtml} 
              onChange={(e) => setDescriptionHtml(e.target.value)} 
              containerProps={{ style: { minHeight: "200px", padding: "10px", fontSize: "14px" } }}
            />
          )}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className={labelClass}>SEO Anahtar Kelimeler</label>
        <input type="text" name="keywords" defaultValue={campaign?.keywords} placeholder="örn. garanti, bonus, market kampanyası (virgülle ayırın)" className={inputClass} />
      </div>

      {/* Date + Slug */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Bitiş Tarihi *</label>
          <input type="date" name="endDate" required defaultValue={campaign?.endDate ? new Date(campaign.endDate).toISOString().split("T")[0] : ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>SEO Slug *</label>
          <input type="text" name="slug" required defaultValue={campaign?.slug} placeholder="kampanya-url" className={inputClass} />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className={labelClass}>Sektörler</label>
        <div className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 max-h-36 overflow-y-auto space-y-1">
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
              <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={campaign?.categories?.some((x: any) => x.id === c.id)} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
              <span className="text-slate-600 text-sm font-semibold group-hover:text-indigo-700 transition-colors">{c.icon} {c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <label className={labelClass}>Markalar / Firmalar</label>
        <div className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 max-h-36 overflow-y-auto space-y-1">
          {brands.map(b => (
            <label key={b.id} className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
              <input type="checkbox" name="brandIds" value={b.id} defaultChecked={campaign?.brands?.some((x: any) => x.id === b.id)} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
              <span className="text-slate-600 text-sm font-semibold group-hover:text-indigo-700 transition-colors">
                {b.name}
                {b.category && <span className="text-slate-400 font-normal ml-1">({b.category.name})</span>}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Credit Cards */}
      <div>
        <label className={labelClass}>Geçerli Kredi Kartları</label>
        <div className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 max-h-36 overflow-y-auto space-y-1">
          {creditCards.map(k => (
            <label key={k.id} className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-white cursor-pointer transition-colors group">
              <input type="checkbox" name="cardIds" value={k.id} defaultChecked={campaign?.creditCards?.some((x: any) => x.id === k.id)} className="w-4 h-4 accent-indigo-600 cursor-pointer" />
              <span className="text-slate-600 text-sm font-semibold group-hover:text-indigo-700 transition-colors">
                💳 {k.name} <span className="text-slate-400 font-normal">– {k.brand.name}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Avantajlar */}
      <div>
        <label className={labelClass}>Avantajlar</label>
        <div className="flex flex-wrap gap-2 p-3 border-2 border-slate-200 rounded-xl bg-slate-50">
          {avantajlar.map(a => (
            <label key={a.id} className="relative cursor-pointer">
              <input type="checkbox" name="avantajIds" value={a.id} defaultChecked={campaign?.avantajlar?.some((x: any) => x.id === a.id)} className="peer sr-only" />
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-black text-slate-600 select-none hover:border-indigo-300 hover:bg-indigo-50 transition-all peer-checked:bg-indigo-600 peer-checked:border-indigo-600 peer-checked:text-white">
                {a.icon} {a.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3.5 rounded-2xl font-black text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"></path>
            </svg>
            İşleniyor...
          </span>
        ) : campaign ? "✓ Kampanyayı Güncelle" : "🚀 Kampanyayı Yayınla"}
      </button>
    </form>
  );
}
