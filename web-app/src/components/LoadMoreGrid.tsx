"use client";

import React, { useState } from "react";

export default function LoadMoreGrid({ 
  children, 
  initialCount = 5, 
  step = 20 
}: { 
  children: React.ReactNode, 
  initialCount?: number, 
  step?: number 
}) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  
  const items = React.Children.toArray(children);
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {visibleItems}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-12 w-full col-span-full">
          <button 
            onClick={() => setVisibleCount(visibleCount + step)}
            className="bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 font-black text-sm px-8 py-3.5 rounded-2xl transition-all shadow-sm flex items-center gap-2 group"
          >
            Devamını Gör
            <svg className="group-hover:translate-y-0.5 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
