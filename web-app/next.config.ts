import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Dış kaynaklı resimler için domain izinleri
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.githubusercontent.com",
        pathname: "/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/kampanya.php',
        has: [{ type: 'query', key: 'id' }],
        destination: '/kampanyalar/:id',
        permanent: true,
      },
      {
        source: '/kategori.php',
        has: [{ type: 'query', key: 'k' }],
        destination: '/kategori/:k',
        permanent: true,
      }
    ];
  },

  // AŞAĞIDAKİ AYAR, SEO VE ESKİ PHP SİTE İÇİN EN KRİTİK AYARDIR:
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          // Eğer Next.js yeni sistemde bir sayfa bulamazsa (404 verecekse), 
          // ÇAKTIRMADAN arka planda eski PHP sitenizi çağırır ve kullanıcıya onu gösterir!
          // Google bunu 404 olarak görmez, orijinal sitenizdeki gibi okur. 
          source: '/:path*',
          destination: 'https://eski.kredikartlari.net/:path*', // <-- Eski sitenizin bağlı olduğu bir alt alan adı olmalı
        },
      ],
    };
  },
};

export default nextConfig;
