"use client";

import React from "react";

const COMMON_ICONS = ["💳", "💰", "🎁", "✈️", "🛒", "⛽", "🍕", "🎯", "💸", "🏆", "📱", "🏥", "🎬", "🚗", "🏨"];

export default function IconPicker() {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {COMMON_ICONS.map(emoji => (
        <button
          key={emoji}
          type="button"
          onClick={() => {
            const input = document.querySelector('input[name="icon"]') as HTMLInputElement;
            if (input) {
              input.value = emoji;
            }
          }}
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xl"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
