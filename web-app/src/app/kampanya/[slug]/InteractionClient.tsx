"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InteractionClient({
  campaignId,
  initialFavorited,
  isLoggedIn,
}: {
  campaignId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/interactions/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });
      if (res.ok) {
        setFavorited(!favorited);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return router.push("/login");
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/interactions/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, text: comment }),
      });
      if (res.ok) {
        setComment("");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 border-t border-slate-100 pt-8 mt-8">
      {/* Favorite */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <div>
          <p className="font-black text-slate-800 text-sm mb-0.5">Bu kampanyayı beğendiniz mi?</p>
          <p className="text-slate-500 text-xs">Favorilere ekleyin, kolayca tekrar bulun.</p>
        </div>
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all active:scale-95 flex-shrink-0 ${
            favorited
              ? "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100"
              : "bg-white text-slate-600 border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          <span>{favorited ? "❤️" : "🤍"}</span>
          {favorited ? "Favorilerde" : "Favoriye Ekle"}
        </button>
      </div>

      {/* Comment form */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h4 className="text-slate-500 font-black text-xs uppercase tracking-widest">Yorum Yap</h4>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2">
            <span>✓</span> Yorumunuz paylaşıldı!
          </div>
        )}

        <form onSubmit={submitComment} className="space-y-3">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isLoggedIn ? "Deneyimlerinizi paylaşın..." : "Yorum yapmak için giriş yapmalısınız."}
            disabled={!isLoggedIn || submitting}
            rows={4}
            className="w-full border-2 border-slate-200 rounded-2xl p-4 text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-400"
          />
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">{comment.length} karakter</span>
            <button
              type="submit"
              disabled={!isLoggedIn || submitting || !comment.trim()}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm font-black text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Gönderiliyor..." : "Paylaş"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
