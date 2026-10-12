import { depthMeta, skillGroups } from "@/data/skills";
import type { SkillDepth } from "@/types";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { DepthMarker, SkillsExplorer } from "./skills-explorer";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative border-t border-line py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          index="03"
          label="Engineering skills"
          id="skills-title"
          title={
            <>
              Depth where it matters, <span className="text-muted">breadth where it helps.</span>
            </>
          }
          intro="Grouped by where I've actually used each one — in client apps shipped to the stores, in my own released products, or as active exploration. No percentages: the evidence is the point."
        />

        <Reveal>
          <ul className="mb-10 flex flex-wrap gap-x-8 gap-y-3" aria-label="Legend">
            {(Object.keys(depthMeta) as SkillDepth[]).map((depth) => (
              <li key={depth} className="flex items-center gap-2.5 text-sm">
                <DepthMarker depth={depth} />
                <span className="font-medium">{depthMeta[depth].label}</span>
                <span className="text-subtle">— {depthMeta[depth].description}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.05}>
          <SkillsExplorer groups={skillGroups} />
        </Reveal>
      </div>
    </section>
  );
}
