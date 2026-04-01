import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // @ts-ignore
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const navItems = [
    { href: "/admin", icon: "📊", label: "Genel Bakış" },
    { href: "/admin/kampanyalar", icon: "✨", label: "Tüm Kampanyalar" },
    { href: "/admin/markalar", icon: "🏢", label: "Markalar" },
    { href: "/admin/kartlar", icon: "💳", label: "Kredi Kartları" },
    { href: "/admin/sektorler", icon: "🏷️", label: "Sektörler" },
    { href: "/admin/avantajlar", icon: "⭐", label: "Avantajlar" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col fixed top-0 left-0 h-full z-40 shadow-sm">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <span>🛡️</span>
            </div>
            <div>
              <div className="text-sm font-black text-slate-800">Admin Panel</div>
              <div className="text-[10px] text-slate-400 font-semibold">KrediKartlari.net</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-3">Yönetim</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 font-semibold text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-all group"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-colors">
            ← Siteye Dön
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
}
