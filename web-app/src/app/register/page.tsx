"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFirmaEditor, setIsFirmaEditor] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [brands, setBrands] = useState<{id: string, name: string}[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFirmaEditor) {
      fetch("/api/brands")
        .then(res => res.json())
        .then(data => {
          setBrands(data);
          if (data.length > 0) setSelectedBrandId(data[0].id);
        })
        .catch(err => console.error("Markalar yüklenemedi", err));
    }
  }, [isFirmaEditor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isFirmaEditor && !selectedBrandId) {
      setError("Lütfen temsil ettiğiniz firmayı seçin.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          role: isFirmaEditor ? "FIRMA_EDITOR" : "USER",
          brandId: isFirmaEditor ? selectedBrandId : null
        }),
      });

      if (res.ok) {
        // Eğer firma editörü ise onay beklemesi gerektiğini belirten bir parametre ile yönlendirelim
        const target = isFirmaEditor ? "/login?pending=true" : "/login";
        router.push(target);
      } else {
        const data = await res.json();
        setError(data.message || "Kayıt işlemi başarısız.");
      }
    } catch (err) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-12">
      <div className="background-blob blob-1"></div>
      <div className="background-blob blob-2" style={{ animationDelay: '-10s' }}></div>

      <div className="w-full max-w-md bg-[#191c29]/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-2">
            <span className="text-[28px]">💳</span>
            <span>KrediKartlari<span className="text-[#7c3aed]">.net</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Kayıt Ol</h1>
          <p className="text-slate-400 mt-2">Avantajları yakalamak için aramıza katılın</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Ad Soyad</label>
            <input
              type="text"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
              placeholder="Adınız Soyadınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">E-posta</label>
            <input
              type="email"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Şifre</label>
            <input
              type="password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-[#7c3aed] focus:ring-[#7c3aed]"
                checked={isFirmaEditor}
                onChange={(e) => setIsFirmaEditor(e.target.checked)}
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Firma Temsilcisiyim (Editör)</span>
            </label>
          </div>

          {isFirmaEditor && (
            <div className="space-y-1 animate-fadeIn">
              <label className="block text-sm font-medium text-slate-300 mb-1">Temsil Ettiğiniz Firma / Marka</label>
              <select
                required
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7c3aed] transition-all"
                value={selectedBrandId}
                onChange={(e) => setSelectedBrandId(e.target.value)}
              >
                <option value="" disabled className="text-black">Firma Seçin...</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id} className="text-black">{brand.name}</option>
                ))}
              </select>
              <p className="text-[12px] text-yellow-400/80 mt-1 italic">
                * Firma editörü hesapları admin onayından sonra aktifleşir.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7c3aed] to-[#00f2fe] hover:opacity-90 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-6 text-white transition-opacity"
          >
            {loading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8">
          Zaten bir hesabınız var mı?{" "}
          <Link href="/login" className="text-[#00f2fe] hover:text-white font-medium transition-colors">
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  );
}
