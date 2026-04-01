import { auth } from "@/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  const navLinks = [
    { href: "/sektorler", label: "Sektörler" },
    { href: "/markalar", label: "Markalar" },
    { href: "/bankalar", label: "Bankalar" },
    { href: "/avantajlar", label: "Avantajlar" },
    { href: "/kredi-kartlari", label: "Kartlar" },
  ];

  return (
    <header className="navbar py-3">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 group-hover:scale-105 transition-all">
            <span className="text-lg">💳</span>
          </div>
          <span className="text-lg font-black text-slate-800 tracking-tight">
            KrediKartlari<span className="text-indigo-500">.net</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-slate-500 font-semibold text-sm hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* @ts-ignore */}
              {(user.role === "ADMIN" || user.role === "EDITOR") && (
                <Link
                  href="/admin"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all"
                >
                  Yönetim Paneli
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-sm">
                  {(user.name || user.email || "?")[0].toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-semibold text-slate-700">
                  {user.name || user.email}
                </span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline px-4 py-2 rounded-lg font-semibold text-sm">
                Giriş Yap
              </Link>
              <Link href="/register" className="btn-primary px-5 py-2 rounded-lg font-bold text-sm text-white">
                Üye Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
