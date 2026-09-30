import { SkyRoot } from "@/components/day/sky-root";
import { DayNav } from "@/components/day/day-nav";
import { Day } from "@/components/day/day";
import { DayFooter, Faq, How, Install, Receipt, Trust } from "@/components/day/sections";

export default function Home() {
  return (
    <SkyRoot>
      <DayNav />
      <main>
        <Day />
        <Receipt />
        <How />
        <Trust />
        <Install />
        <Faq />
      </main>
      <DayFooter />
    </SkyRoot>
  );
}
