export default function Loading() {
  return (
    <div className="px-page py-16" aria-busy="true" aria-label="Loading">
      <div className="skeleton mb-6 h-10 w-1/3" />
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[4/5]" />)}</div>
    </div>
  );
}
