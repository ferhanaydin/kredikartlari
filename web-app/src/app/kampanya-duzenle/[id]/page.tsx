import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignForm from "@/app/admin/CampaignForm";

const prisma = new PrismaClient();

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const { id } = await params;

  // @ts-ignore
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      brands: true,
      categories: true,
      creditCards: true,
      avantajlar: true,
    }
  });

  if (!campaign) {
    notFound();
  }

  // Permissions validation
  const user = session.user as any;
  if (user.role !== "ADMIN") {
    // If not admin, check if user is the author or belongs to a brand in this campaign
    const isAuthor = campaign.authorId === user.id;
    const isBrandEditor = campaign.brands.some((b: any) => b.id === user.brandId);
    
    if (!isAuthor && !isBrandEditor) {
      redirect("/"); // Unauthorized
    }
  }

  const [categories, brands, creditCards, avantajlar] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, include: { category: true } }),
    prisma.creditCard.findMany({ where: { isActive: true }, orderBy: { name: "asc" }, include: { brand: true } }),
    prisma.avantaj.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-3"></div>
      <Header />

      <main className="flex-1 relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900">✏️ Kampanya Düzenle</h1>
            <p className="text-slate-500 mt-2">
              <span className="font-semibold text-slate-700">{campaign.title}</span> kampanyasını güncelliyorsunuz.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <CampaignForm
              categories={categories}
              brands={brands}
              creditCards={creditCards}
              avantajlar={avantajlar}
              campaign={campaign}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
