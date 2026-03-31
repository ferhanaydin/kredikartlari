"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InteractionClient({ 
  campaignId, 
  initialFavorited, 
  isLoggedIn 
}: { 
  campaignId: string, 
  initialFavorited: boolean, 
  isLoggedIn: boolean 
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("Favoriye eklemek için giriş yapmalısınız.");
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
    if (!isLoggedIn) {
       alert("Yorum yapmak için giriş yapmalısınız.");
       return router.push("/login");
    }
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/interactions/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, text: comment }),
      });
      if (res.ok) {
         setComment("");
         router.refresh(); // Yorumların anında ekranda görünmesi için
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 border-t border-white/10 pt-8 mt-8">
      {/* Favori Butonu */}
      <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10">
         <div>
            <h4 className="text-white font-medium">Bu kampanyayı beğendin mi?</h4>
            <p className="text-slate-400 text-sm">Kaydet ve hesabından kolayca ulaş.</p>
         </div>
         <button 
           onClick={toggleFavorite}
           disabled={loading}
           className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
             favorited 
               ? "bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500/30" 
               : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
           }`}
         >
           {favorited ? "❤️ Favorilere Eklendi" : "🤍 Favoriye Ekle"}
         </button>
      </div>

      {/* Yorum Formu */}
      <div>
         <h4 className="text-white font-medium mb-4">Bir Yorum Bırakın</h4>
         <form onSubmit={submitComment} className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isLoggedIn ? "Düşüncelerinizi paylaşın..." : "Yorum yapmak için giriş yapmalısınız..."}
              disabled={!isLoggedIn || loading}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe] min-h-[120px] transition-colors"
            />
            <button 
              type="submit" 
              disabled={!isLoggedIn || loading || !comment.trim()}
              className="absolute bottom-4 right-4 btn-primary px-6 py-2 rounded-lg text-sm disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Paylaş"}
            </button>
         </form>
      </div>
    </div>
  );
}
