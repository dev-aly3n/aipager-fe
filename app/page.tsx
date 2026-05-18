import { ThemeToggle } from "@/components/theme-toggle";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { TelegramMockup } from "@/components/telegram-mockup";
import { Features } from "@/components/features";
import { InstallSteps } from "@/components/install-steps";
import { KeyboardPreview } from "@/components/keyboard-preview";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <ThemeToggle />
      <Nav />
      <main>
        <Hero />
        <TelegramMockup />
        <Features />
        <InstallSteps />
        <KeyboardPreview />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
