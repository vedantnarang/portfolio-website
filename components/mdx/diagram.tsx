import Image from "next/image";

/* ============================================================
   Architecture diagram frame (spec §3): pre-exported static SVG
   only — never client Mermaid (PLAN Phase 2 §7.2). Fixed
   dimensions keep CLS at zero; lazy-loaded mid-page.

   <Diagram id={4} alt="Flickstat data flow" />
   serves /diagrams/pr-4.svg (960×540 viewBox).
   ============================================================ */

export function Diagram({
  id,
  alt,
  caption,
}: {
  id: number;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-md border border-line bg-canvas">
        <Image
          src={`/diagrams/pr-${id}.svg`}
          alt={alt}
          width={960}
          height={540}
          unoptimized
          loading="lazy"
          className="h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
