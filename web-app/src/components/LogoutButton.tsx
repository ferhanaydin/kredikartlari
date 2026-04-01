"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
    >
      Çıkış Yap
    </button>
  );
}
