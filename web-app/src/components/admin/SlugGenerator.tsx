"use client";

import { useEffect } from "react";

export default function SlugGenerator({ sourceName, targetName }: { sourceName: string, targetName: string }) {
  useEffect(() => {
    // Biraz gecikme ekleyelim ki DOM elementleri renderlandığından emin olalım
    const timeoutId = setTimeout(() => {
      const sourceNode = document.querySelector(`input[name="${sourceName}"]`);
      const targetNode = document.querySelector(`input[name="${targetName}"]`);

      if (!sourceNode || !targetNode) return;

      const generateSlug = (text: string) => {
        let trMap: Record<string, string> = {
          'çÇ': 'c',
          'ğĞ': 'g',
          'şŞ': 's',
          'üÜ': 'u',
          'ıİ': 'i',
          'öÖ': 'o'
        };
        for (let key in trMap) {
          text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
        }
        return text
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-") // Boşlukları ve özel karakterleri tireye çevir
          .replace(/-+/g, "-")         // Yan yana gelen tireleri tek tireye çevir
          .replace(/^-|-$/g, "");      // Baştaki ve sondaki tireleri kaldır
      };

      const handleInput = (e: Event) => {
        // Hedef inputu manuel olarak değiştirdiysek bozmayalım, ama eğer target boş ise veya daha önce dokunulmadıysa ezsin
        if (!targetNode.getAttribute('data-touched')) {
          const val = generateSlug((e.target as HTMLInputElement).value);
          (targetNode as HTMLInputElement).value = val;
        }
      };

      const handleTargetInput = () => {
        targetNode.setAttribute('data-touched', 'true');
      };

      // Eğer hali hazırda slug doluysa edit ekranındayız demektir, oto-değişimi kapatalım
      if ((targetNode as HTMLInputElement).value) {
        targetNode.setAttribute('data-touched', 'true');
      }

      sourceNode.addEventListener("input", handleInput);
      targetNode.addEventListener("input", handleTargetInput);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [sourceName, targetName]);

  return null;
}
