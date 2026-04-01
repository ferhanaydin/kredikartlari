import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignList from "@/components/CampaignList";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Home() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "PUBLISHED" },
    include: {
      brands: true,
      categories: true,
      creditCards: { include: { brand: true } },
      avantajlar: true,
    },
    orderBy: { createdAt: "desc" }
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  const avantajlar = await prisma.avantaj.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="background-blob blob-1"></div>
      <div className="background-blob blob-2"></div>

      <Header />

      <main className="flex-1">
        <CampaignList 
          initialCampaigns={JSON.parse(JSON.stringify(campaigns))}
          categories={JSON.parse(JSON.stringify(categories))}
          brands={JSON.parse(JSON.stringify(brands))}
          avantajlar={JSON.parse(JSON.stringify(avantajlar))}
        />
      </main>

      <Footer />
    </div>
  );
}

