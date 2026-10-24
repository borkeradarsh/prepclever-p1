import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Blueprint } from "@/components/sections/Blueprint";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Faq } from "@/components/sections/Faq";
import { GrowthStory } from "@/components/sections/GrowthStory";
import { Hero } from "@/components/sections/Hero";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyGcc } from "@/components/sections/WhyGcc";

export const metadata: Metadata = {
  title: "PrepClever — the AI engineering career roadmap for GCCs",
  description:
    "One sequenced plan for an AI engineering role at a Global Capability Centre in India: market intelligence, gap analysis, curated upskilling, positioning, referrals and interview prep.",
};

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <LogoMarquee />
      <GrowthStory />
      <WhyGcc />
      <Blueprint />
      <Testimonials />
      <Faq />
      <ClosingCta />
      <Footer />
    </main>
  );
}
