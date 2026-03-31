"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <div className="background-blob blob-1"></div>
      <div className="background-blob blob-2"></div>

      <div className="w-full max-w-md bg-[#191c29]/60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-2">
            <span className="text-[28px]">💳</span>
            <span>KrediKartlari<span className="text-[#00f2fe]">.net</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Hoş Geldiniz</h1>
          <p className="text-slate-400 mt-2">Avantajlar dünyasına giriş yapın</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 mt-6"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#1e2136] text-slate-400 rounded-full">Veya şununla devam et</span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google ile Giriş Yap
          </button>
        </div>

        <p className="text-center text-slate-400 mt-8">
          Hesabınız yok mu?{" "}
          <Link href="/register" className="text-[#00f2fe] hover:text-white font-medium transition-colors">
            Hemen Kaydolun
          </Link>
        </p>
      </div>
    </div>
  );
}
