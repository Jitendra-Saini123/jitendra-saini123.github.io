import { cn } from "@/lib/cn";

const SLABS = 9;

const rings = [
  { inset: "14%", rx: "74deg", rz: "-12deg", dur: "38s", color: "border-cyan/30", node: "bg-cyan" },
  { inset: "4%", rx: "68deg", rz: "18deg", dur: "52s", color: "border-violet/30", node: "bg-violet-soft" },
  { inset: "-8%", rx: "78deg", rz: "4deg", dur: "70s", color: "border-cyan-soft/15", node: "bg-cyan-soft" },
];

/**
 * CSS-only version of the hero sculpture. It is server-rendered, so it is the
 * first thing visitors see; the WebGL scene cross-fades over it once ready.
 * It is also the permanent fallback when WebGL is unavailable or fails.
 */
export function HeroFallback({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 transition-opacity duration-[1600ms] ease-out", hidden ? "opacity-0" : "opacity-100")}
    >
      <div className="hero-fallback-stage absolute left-1/2 top-[46%] size-[min(72vw,26rem)] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-[78%] lg:size-[min(40vw,34rem)]">
        <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgb(69_217_255/0.24),transparent_62%)] blur-2xl" />
        <div className="absolute -right-[12%] -top-[6%] size-[72%] rounded-full bg-[radial-gradient(circle,rgb(139_112_255/0.22),transparent_66%)] blur-3xl" />

        {rings.map((ring, i) => (
          <div
            key={i}
            className={cn("orbit absolute rounded-full border", ring.color)}
            style={{ inset: ring.inset, ["--rx" as string]: ring.rx, ["--rz" as string]: ring.rz, ["--dur" as string]: ring.dur }}
          >
            <span className={cn("absolute -top-[3px] left-1/2 size-1.5 rounded-full shadow-[0_0_12px_2px_rgb(69_217_255/0.6)]", ring.node)} />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col-reverse items-center justify-center gap-[2.6%]">
          {Array.from({ length: SLABS }, (_, i) => {
            const width = 60 - i * 3.1;
            const glass = i % 2 === 1;
            return (
              <div
                key={i}
                className="hero-slab relative h-[5.2%]"
                style={{ width: `${width}%`, ["--i" as string]: i }}
              >
                <div
                  className={cn(
                    "absolute inset-0 [clip-path:polygon(16%_0,84%_0,100%_50%,84%_100%,16%_100%,0_50%)]",
                    glass
                      ? "bg-[linear-gradient(90deg,rgb(69_217_255/0.08),rgb(158_234_255/0.32)_48%,rgb(69_217_255/0.08))]"
                      : "bg-[linear-gradient(90deg,#0b1122,#24304f_46%,#0b1122)]",
                  )}
                />
                <div className="absolute inset-x-[16%] top-0 h-px bg-cyan/60" />
              </div>
            );
          })}
        </div>

        <div className="absolute left-1/2 top-[22%] h-[56%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-cyan to-transparent opacity-80 shadow-[0_0_14px_2px_rgb(69_217_255/0.5)]" />
      </div>
    </div>
  );
}
