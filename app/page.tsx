import { Nav } from "@/components/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how";
import { Install } from "@/components/landing/install";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Install />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
