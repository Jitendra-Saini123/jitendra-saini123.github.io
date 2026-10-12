import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/section-heading";
import { WorkGallery } from "@/components/projects/work-gallery";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionHeading
          index="01"
          label="Selected work"
          id="work-title"
          title={
            <>
              Products I&rsquo;ve designed, built <span className="text-muted">and shipped.</span>
            </>
          }
          intro="Apps on Google Play, a live web product and a game in development — each one built end to end, from the first commit to the store listing. Open a case study for the engineering behind it."
        />
        <WorkGallery projects={projects} />
      </div>
    </section>
  );
}
