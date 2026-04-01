"use client";

import React from "react";

const SECTOR_ICONS = [
  "🏦", "🛒", "⛽", "👗", "✈️", "💻", "🍔", "📚", "🏥", "🛋️", "⚽", "💄", 
  "🚗", "🛡️", "🎨", "🏖️", "📖", "🛠️", "💎", "🧸", "🐶", "🌱", "🔖",
  "💳", "💰", "🎁", "🍕", "🎯", "💸", "🏆", "📱", "🏨", "🎬", "🎫", "🎭"
];

export default function IconPicker() {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {SECTOR_ICONS.map(emoji => (
        <button
          key={emoji}
          type="button"
          onClick={() => {
            const input = document.querySelector('input[name="icon"]') as HTMLInputElement;
            if (input) {
              input.value = emoji;
              // Trigger input event for preview if needed
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          }}
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-xl flex items-center justify-center hover:scale-110 active:scale-95"
          title="Seçmek için tıkla"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
