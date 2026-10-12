import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { NowStrip } from "@/components/sections/now-strip";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Philosophy } from "@/components/sections/philosophy";
import { Content } from "@/components/sections/content";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <NowStrip />
      <Work />
      <About />
      <Skills />
      <Experience />
      <Philosophy />
      <Content />
      <Contact />
    </>
  );
}
