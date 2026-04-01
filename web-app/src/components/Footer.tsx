import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/sektorler", label: "Sektörler" },
    { href: "/markalar", label: "Markalar" },
    { href: "/bankalar", label: "Bankalar" },
    { href: "/avantajlar", label: "Avantajlar" },
    { href: "/kredi-kartlari", label: "Kredi Kartları" },
  ];

  const legalLinks = [
    "Kullanım Koşulları",
    "Gizlilik Politikası",
    "Çerez Politikası",
    "İletişim",
    "Hakkımızda",
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand col */}
          <div className="md:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-105 transition-all">
                <span className="text-lg">💳</span>
              </div>
              <span className="text-lg font-black text-slate-800">
                KrediKartlari<span className="text-indigo-500">.net</span>
              </span>
            </Link>

            <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
              Türkiye'nin en kapsamlı kredi kartı kampanya platformu. En güncel banka fırsatlarını, marka indirimlerini ve özel teklifleri anında keşfedin.
            </p>

            {/* Social placeholder */}
            <div className="flex gap-2">
              {["𝕏", "IG", "in"].map((s) => (
                <div key={s} className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 text-[11px] font-black hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-all shadow-sm">
                  {s}
                </div>
              ))}
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400 text-xs font-semibold">Tüm sistemler aktif</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-5">Hızlı Linkler</h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold">
                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors flex-shrink-0"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-5">Yasal & Destek</h3>
            <ul className="space-y-3">
              {legalLinks.map(label => (
                <li key={label}>
                  <Link href="#" className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold">
                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors flex-shrink-0"></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-semibold">
            © 2026 KrediKartlari.net — Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="font-semibold">Güvenli & Güncel Veriler</span>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 text-[8px] font-black">✓</div>
              <span className="font-semibold">SSL Korumalı</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
