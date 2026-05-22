import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Demo } from "@/components/demo";
import { Sessions } from "@/components/sessions";
import { HowItWorks } from "@/components/how";
import { Install } from "@/components/install";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Demo />
        <Sessions />
        <HowItWorks />
        <Install />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
