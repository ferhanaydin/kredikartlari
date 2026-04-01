"use client";

import { useState } from "react";

interface Props {
  items: React.ReactNode[];
  limit?: number;
  gridClassName?: string;
}

export default function ExpandableGrid({ 
  items, 
  limit = 20, 
  gridClassName = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3" 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasMore = items.length > limit;
  const displayedItems = isExpanded ? items : items.slice(0, limit);

  return (
    <div className="space-y-10">
      <div className={gridClassName}>
        {displayedItems.map((item, index) => (
          <div 
            key={index}
            className="animate-fadeIn"
            style={{ animationDelay: `${(index % limit) * 0.05}s` }}
          >
            {item}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group flex flex-col items-center gap-3 text-slate-400 hover:text-white transition-all focus:outline-none"
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em]">
              {isExpanded ? "Daha Az Göster" : `Tümünü Gör (${items.length})`}
            </span>
            <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-[#7c3aed] group-hover:border-[#7c3aed] transition-all transform ${isExpanded ? 'rotate-180' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
