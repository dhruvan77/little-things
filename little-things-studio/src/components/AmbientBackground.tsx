/** Fixed ambient layer: slow drifting blobs (site palette variables only) plus subtle film grain. Pure CSS, transform-only animation. */
export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden motion-reduce:[&_.ambient-blob]:animate-none">
      <div className="ambient-blob -left-[10vw] top-[5vh] h-[45vw] w-[45vw] bg-blush" style={{ animation: "blobA 26s ease-in-out infinite" }} />
      <div className="ambient-blob -right-[12vw] top-[35vh] h-[40vw] w-[40vw] bg-sage" style={{ animation: "blobB 32s ease-in-out infinite" }} />
      <div className="ambient-blob bottom-[-10vh] left-[25vw] h-[38vw] w-[38vw] bg-tertiary-fixed" style={{ animation: "blobC 29s ease-in-out infinite" }} />
      <div className="ambient-grain" />
    </div>
  );
}
