import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden className="grid-backdrop absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />
      <div className="container-page text-center">
        <p className="eyebrow text-cyan">Error 404</p>
        <h1 className="text-display mx-auto mt-6 max-w-3xl text-[clamp(2.6rem,7vw,5.5rem)]">
          This floor <span className="font-serif font-normal italic text-cyan-soft">hasn&rsquo;t been built yet.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
        <Link href="/" className={buttonClasses("primary", "lg", "mt-10")}>
          <ArrowLeft aria-hidden size={17} />
          Back to the portfolio
        </Link>
      </div>
    </section>
  );
}
