// Shown during route navigation. Simple skeleton that mirrors a page header + cards.
export default function Loading() {
  return (
    <div className="animate-pulse p-6">
      <div className="h-8 w-56 rounded-lg bg-zinc-200" />
      <div className="mt-2 h-4 w-80 rounded bg-zinc-100" />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl border border-zinc-200 bg-white" />
        ))}
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl border border-zinc-200 bg-white" />
        ))}
      </div>
    </div>
  );
}
