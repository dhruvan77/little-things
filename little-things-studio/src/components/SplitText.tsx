import { createElement } from "react";

export type Part = { t: string; em?: boolean; br?: boolean };
/** Renders words as individually animatable spans (animated by PageFX via data-anim="words"). */
export function SplitText({ as = "h2", parts, className }: { as?: string; parts: Part[]; className?: string }) {
  const label = parts.filter((p) => !p.br).map((p) => p.t).join(" ");
  const kids: React.ReactNode[] = [];
  parts.forEach((p, pi) => {
    if (p.br) return kids.push(<br key={`b${pi}`} />);
    p.t.split(" ").filter(Boolean).forEach((w, wi) =>
      kids.push(
        <span key={`${pi}-${wi}`} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <span className={`w inline-block ${p.em ? "italic font-normal text-on-tertiary-container" : ""}`}>{w}&nbsp;</span>
        </span>
      )
    );
  });
  return createElement(as, { className, "data-anim": "words", "aria-label": label }, kids);
}
