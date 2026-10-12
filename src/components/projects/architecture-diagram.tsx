import type { ArchitectureNode, ProjectArchitecture } from "@/types";
import { cn } from "@/lib/cn";

const CELL_W = 250;
const CELL_H = 150;
const NODE_W = 206;
const NODE_H = 84;
const PAD = 12;

function box(node: ArchitectureNode) {
  const x = PAD + node.col * CELL_W + (CELL_W - NODE_W) / 2;
  const y = PAD + node.row * CELL_H + (CELL_H - NODE_H) / 2;
  return { x, y, cx: x + NODE_W / 2, cy: y + NODE_H / 2 };
}

/** Orthogonal-ish connector between two node boxes. */
function edgePath(a: ArchitectureNode, b: ArchitectureNode): string {
  const A = box(a);
  const B = box(b);
  if (a.row === b.row) {
    const dir = b.col > a.col ? 1 : -1;
    const x1 = dir > 0 ? A.x + NODE_W : A.x;
    const x2 = dir > 0 ? B.x : B.x + NODE_W;
    return `M ${x1} ${A.cy} L ${x2 - dir * 6} ${B.cy}`;
  }
  if (a.col === b.col) {
    const dir = b.row > a.row ? 1 : -1;
    const y1 = dir > 0 ? A.y + NODE_H : A.y;
    const y2 = dir > 0 ? B.y : B.y + NODE_H;
    return `M ${A.cx} ${y1} L ${B.cx} ${y2 - dir * 6}`;
  }
  // Different row and column: leave vertically, arrive horizontally.
  const dirY = b.row > a.row ? 1 : -1;
  const dirX = b.col > a.col ? 1 : -1;
  const y1 = dirY > 0 ? A.y + NODE_H : A.y;
  const x2 = dirX > 0 ? B.x : B.x + NODE_W;
  return `M ${A.cx} ${y1} C ${A.cx} ${B.cy}, ${A.cx} ${B.cy}, ${x2 - dirX * 6} ${B.cy}`;
}

/** Nodes in flow order (sources first), for the linear mobile / screen-reader view. */
function flowOrder(arch: ProjectArchitecture): ArchitectureNode[] {
  const byId = new Map(arch.nodes.map((n) => [n.id, n]));
  const incoming = new Map(arch.nodes.map((n) => [n.id, 0]));
  for (const [, to] of arch.edges) incoming.set(to, (incoming.get(to) ?? 0) + 1);
  const queue = arch.nodes.filter((n) => incoming.get(n.id) === 0).map((n) => n.id);
  const seen = new Set<string>();
  const order: ArchitectureNode[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    if (seen.has(id)) continue;
    seen.add(id);
    order.push(byId.get(id)!);
    for (const [from, to] of arch.edges) if (from === id && !seen.has(to)) queue.push(to);
  }
  for (const n of arch.nodes) if (!seen.has(n.id)) order.push(n);
  return order;
}

/**
 * Architecture as a flow diagram with animated data moving along each
 * connection (static under reduced motion). On small screens it becomes an
 * ordered list, which is also what screen readers get.
 */
export function ArchitectureDiagram({ architecture, accent }: { architecture: ProjectArchitecture; accent: string }) {
  const width = PAD * 2 + architecture.columns * CELL_W;
  const height = PAD * 2 + architecture.rows * CELL_H;
  const byId = new Map(architecture.nodes.map((n) => [n.id, n]));
  const order = flowOrder(architecture);
  const targetsOf = (id: string) => architecture.edges.filter(([from]) => from === id).map(([, to]) => byId.get(to)!.label);

  return (
    <figure>
      <div className="surface relative hidden overflow-hidden rounded-[1.5rem] p-4 md:block" style={{ ["--accent" as string]: accent }}>
        <div aria-hidden className="grid-backdrop absolute inset-0 opacity-50 [mask-image:radial-gradient(80%_80%_at_50%_50%,black,transparent)]" />
        <svg viewBox={`0 0 ${width} ${height}`} className="relative h-auto w-full" aria-hidden focusable="false">
          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#45d9ff" opacity="0.8" />
            </marker>
          </defs>
          {architecture.edges.map(([from, to]) => {
            const d = edgePath(byId.get(from)!, byId.get(to)!);
            return (
              <g key={`${from}-${to}`}>
                <path d={d} fill="none" stroke="rgb(69 217 255 / 0.28)" strokeWidth={1.5} markerEnd="url(#arch-arrow)" />
                <path d={d} fill="none" stroke="#9eeaff" strokeWidth={2} strokeLinecap="round" className="arch-flow" />
              </g>
            );
          })}
          {architecture.nodes.map((node) => {
            const { x, y } = box(node);
            return (
              <foreignObject key={node.id} x={x} y={y} width={NODE_W} height={NODE_H}>
                <div
                  className={cn(
                    "flex h-full flex-col justify-center rounded-[14px] border px-4",
                    node.core
                      ? "border-[rgb(69_217_255/0.6)] bg-[rgb(69_217_255/0.08)] shadow-[0_0_24px_-6px_rgb(69_217_255/0.5)]"
                      : "border-[rgb(162_172_194/0.24)] bg-[#0b1122]",
                  )}
                >
                  <p className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#f5f7ff]">{node.label}</p>
                  {node.detail && <p className="mt-1 font-mono text-[10.5px] leading-snug text-[#a2acc2]">{node.detail}</p>}
                </div>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      <ol className="space-y-2 md:sr-only">
        {order.map((node, i) => {
          const targets = targetsOf(node.id);
          return (
            <li key={node.id} className={cn("surface rounded-xl p-4", node.core && "border-cyan/40")}>
              <p className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-semibold">{node.label}</span>
              </p>
              {node.detail && <p className="mt-1 pl-8 font-mono text-xs text-muted">{node.detail}</p>}
              {targets.length > 0 && <p className="mt-1.5 pl-8 text-xs text-subtle">→ {targets.join(", ")}</p>}
            </li>
          );
        })}
      </ol>

      <figcaption className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{architecture.caption}</figcaption>
    </figure>
  );
}
