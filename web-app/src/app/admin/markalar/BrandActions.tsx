"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  isActive: boolean;
  entity: "brand" | "card" | "category" | "avantaj";
}

const entityApiMap = {
  brand: "/api/admin/brands",
  card: "/api/admin/cards",
  category: "/api/admin/categories",
  avantaj: "/api/admin/avantajlar",
};

export default function BrandActions({ id, isActive, entity }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${entityApiMap[entity]}/${id}/toggle`, {
        method: "PATCH",
      });
      if (res.ok) {
        setActive(!active);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black transition-all disabled:opacity-50 ${
        active
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
          : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
      }`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? "bg-emerald-500" : "bg-slate-400"}`}></span>
      {loading ? "..." : active ? "Aktif" : "Pasif"}
    </button>
  );
}
