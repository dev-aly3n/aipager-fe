import { Nav } from "@/components/nav";
import { Story } from "@/components/story/story";
import { Install } from "@/components/sections/install";
import { Boundary } from "@/components/sections/boundary";
import { Team } from "@/components/sections/team";
import { Faq } from "@/components/sections/faq";
import { Outro } from "@/components/sections/outro";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Story />
        <Install />
        <Boundary />
        <Team />
        <Faq />
        <Outro />
      </main>
      <Footer />
    </>
  );
}
