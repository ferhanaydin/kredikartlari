import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        // Örnek: kredikartlari.net/kampanya.php?id=123 -> kredikartlari.net/kampanyalar/123
        source: '/kampanya.php',
        has: [
          {
            type: 'query',
            key: 'id',
          },
        ],
        destination: '/kampanyalar/:id',
        permanent: true, // 301 SEO uyumlu kalıcı yönlendirme
      },
      {
        // Örnek: kredikartlari.net/kategori.php?k=market -> kredikartlari.net/kategori/market
        source: '/kategori.php',
        has: [
          {
            type: 'query',
            key: 'k',
          },
        ],
        destination: '/kategori/:k',
        permanent: true, // 301 kalıcı
      }
    ]
  },
};

export default nextConfig;
