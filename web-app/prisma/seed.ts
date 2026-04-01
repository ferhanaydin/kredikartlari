import { PrismaClient, Role } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding başlıyor...");

  // ── 1. Sektörler (Categories) ───────────────────────────────
  const sektorler = [
    { name: "Banka",      slug: "banka",       icon: "🏦" },
    { name: "Market",     slug: "market",      icon: "🛒" },
    { name: "Akaryakıt",  slug: "akaryakit",   icon: "⛽" },
    { name: "Giyim",      slug: "giyim",       icon: "👗" },
    { name: "Seyahat",    slug: "seyahat",     icon: "✈️" },
    { name: "Elektronik", slug: "elektronik",  icon: "💻" },
    { name: "Yemek",      slug: "yemek",       icon: "🍔" },
    { name: "Eğitim",     slug: "egitim",      icon: "📚" },
    { name: "Sağlık",     slug: "saglik",      icon: "🏥" },
    { name: "Mobilya",    slug: "mobilya",     icon: "🛋️" },
    { name: "Spor",       slug: "spor",        icon: "⚽" },
    { name: "Kozmetik",   slug: "kozmetik",    icon: "💄" },
    { name: "Otomotiv",   slug: "otomotiv",    icon: "🚗" },
    { name: "Sigorta",    slug: "sigorta",     icon: "🛡️" },
    { name: "Hobi",       slug: "hobi",        icon: "🎨" },
    { name: "Tatil",      slug: "tatil",       icon: "🏖️" },
    { name: "Kitap",      slug: "kitap",       icon: "📖" },
    { name: "Hizmet",     slug: "hizmet",      icon: "🛠️" },
    { name: "Mücevher",    slug: "mucevher",    icon: "💎" },
    { name: "Oyuncak",    slug: "oyuncak",     icon: "🧸" },
    { name: "Pet Shop",   slug: "pet-shop",    icon: "🐶" },
    { name: "Bahçe",      slug: "bahce",       icon: "🌱" },
    { name: "Diğer",      slug: "diger",       icon: "🔖" },
  ];

  const dbSektorler: Record<string, any> = {};
  for (const s of sektorler) {
    dbSektorler[s.slug] = await prisma.category.upsert({
      where: { slug: s.slug },
      update: { name: s.name, icon: s.icon },
      create: s,
    });
  }
  console.log(`✅ ${sektorler.length} sektör eklendi`);

  // ── 2. Firmalar (Brands) ────────────────────────────────────
  const firmalar = [
    { name: "Garanti BBVA",  slug: "garanti",      cat: "banka" },
    { name: "Yapı Kredi",    slug: "yapi-kredi",   cat: "banka" },
    { name: "Akbank",        slug: "akbank",       cat: "banka" },
    { name: "İş Bankası",    slug: "is-bankasi",   cat: "banka" },
    { name: "QNB Finansbank", slug: "qnb",         cat: "banka" },
    { name: "Opet",          slug: "opet",         cat: "akaryakit" },
    { name: "Petrol Ofisi",  slug: "petrol-ofisi", cat: "akaryakit" },
    { name: "Shell",         slug: "shell",        cat: "akaryakit" },
    { name: "Media Markt",   slug: "media-markt",  cat: "elektronik" },
    { name: "Teknosa",       slug: "teknosa",      cat: "elektronik" },
    { name: "Vatan Bilgisayar", slug: "vatan",     cat: "elektronik" },
    { name: "Migros",        slug: "migros",       cat: "market" },
    { name: "CarrefourSA",   slug: "carrefour",    cat: "market" },
    { name: "BİM",           slug: "bim",          cat: "market" },
    { name: "A101",          slug: "a101",         cat: "market" },
    { name: "Zara",          slug: "zara",         cat: "giyim" },
    { name: "LC Waikiki",    slug: "lcw",          cat: "giyim" },
    { name: "H&M",           slug: "hm",           cat: "giyim" },
    { name: "Boyner",        slug: "boyner",       cat: "giyim" },
    { name: "Setur",         slug: "setur",        cat: "seyahat" },
    { name: "Etstur",        slug: "etstur",       cat: "seyahat" },
    { name: "Pegasus",       slug: "pegasus",      cat: "seyahat" },
    { name: "THY",           slug: "thy",          cat: "seyahat" },
    { name: "Burger King",    slug: "burger-king",  cat: "yemek" },
    { name: "Domino's",      slug: "dominos",      cat: "yemek" },
  ];

  const dbFirmalar: Record<string, any> = {};
  for (const f of firmalar) {
    dbFirmalar[f.slug] = await prisma.brand.upsert({
      where: { slug: f.slug },
      update: { name: f.name, categoryId: dbSektorler[f.cat].id },
      create: { 
        name: f.name, 
        slug: f.slug, 
        categoryId: dbSektorler[f.cat].id 
      },
    });
  }
  console.log(`✅ ${firmalar.length} firma eklendi`);

  // ── 3. Kredi Kartları (CreditCards) ──────────────────────────
  const kartlar = [
    { name: "Bonus",         slug: "bonus",      brand: "garanti" },
    { name: "Miles & Smiles",slug: "miles-smiles",brand: "garanti" },
    { name: "World",         slug: "world",      brand: "yapi-kredi" },
    { name: "Axess",         slug: "axess",      brand: "akbank" },
  ];

  const dbKartlar: Record<string, any> = {};
  for (const k of kartlar) {
    dbKartlar[k.slug] = await prisma.creditCard.upsert({
      where: { slug: k.slug },
      update: { name: k.name, brandId: dbFirmalar[k.brand].id },
      create: {
        name: k.name,
        slug: k.slug,
        brandId: dbFirmalar[k.brand].id
      }
    });
  }
  console.log(`✅ ${kartlar.length} kredi kartı eklendi`);

  // ── 4. Avantajlar ───────────────────────────────────────────
  const avantajlar = [
    { name: "Puan",          slug: "puan",          icon: "⭐" },
    { name: "Artı Taksit",   slug: "arti-taksit",   icon: "📅" },
    { name: "İndirim",       slug: "indirim",        icon: "🏷️" },
    { name: "Çekiliş",       slug: "cekilis",        icon: "🎁" },
  ];

  const dbAvantajlar: Record<string, any> = {};
  for (const a of avantajlar) {
    dbAvantajlar[a.slug] = await prisma.avantaj.upsert({
      where: { slug: a.slug },
      update: { name: a.name, icon: a.icon },
      create: a,
    });
  }
  console.log(`✅ ${avantajlar.length} avantaj eklendi`);

  // ── 5. Test Kullanıcıları ────────────────────────────────────
  const testUsers = [
    { name: "Admin", email: "admin@kredikartlari.net", role: "ADMIN" as const },
    { name: "Editor", email: "editor@kredikartlari.net", role: "EDITOR" as const },
    { name: "User", email: "user@kredikartlari.net", role: "USER" as const },
  ];

  for (const u of testUsers) {
    const hashedPassword = await bcryptjs.hash("password123", 10);
    await prisma.user.upsert({
      where: { email: u.email },
      // @ts-ignore
      update: { role: u.role as Role, password: hashedPassword },
      create: {
        name: u.name,
        email: u.email,
        // @ts-ignore
        role: u.role as Role,
        password: hashedPassword,
        isApproved: true
      },
    });
  }
  console.log(`✅ Test kullanıcıları eklendi`);

  // ── 6. Örnek Kampanyalar (Multi-Linked) ──────────────────────
  const sampleCampaigns = [
    {
      title: "Garanti Bonus x Opet 75 TL Puan",
      description: "Opet istasyonlarında farklı günlerde ve tek seferde yapılacak 4 adet 500 TL ve üzeri harcamaya 75 TL bonus!",
      slug: "bonus-opet-kampanya",
      brands: ["garanti", "opet"],
      categories: ["banka", "akaryakit"],
      cards: ["bonus"],
      avantajlar: ["puan"]
    },
    {
      title: "Yapı Kredi World ile Migros'ta 100 TL İndirim",
      description: "Migros sanal market harcamalarınıza özel 100 TL Worldpuan veya indirim fırsatı.",
      slug: "world-migros-kampanya",
      brands: ["yapi-kredi", "migros"],
      categories: ["banka", "market"],
      cards: ["world"],
      avantajlar: ["puan", "indirim"]
    }
  ];

  for (const c of sampleCampaigns) {
    await prisma.campaign.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        title: c.title,
        description: c.description,
        slug: c.slug,
        status: "PUBLISHED",
        endDate: new Date("2026-12-31"),
        brands: { connect: c.brands.map(s => ({ id: dbFirmalar[s].id })) },
        categories: { connect: c.categories.map(s => ({ id: dbSektorler[s].id })) },
        creditCards: { connect: c.cards.map(s => ({ id: dbKartlar[s].id })) },
        avantajlar: { connect: c.avantajlar.map(s => ({ id: dbAvantajlar[s].id })) }
      }
    });
  }
  console.log(`✅ Örnek kampanyalar eklendi`);

  console.log("🎉 Seed tamamlandı!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
