import { SkyRoot } from "@/components/day/sky-root";
import { DayNav } from "@/components/day/day-nav";
import { DayStage } from "@/components/stage/day-stage";
import { DayFooter, Faq, How, Install, Receipt, Trust } from "@/components/day/sections";

export default function Home() {
  return (
    <SkyRoot>
      <DayNav />
      <main>
        <DayStage />
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
