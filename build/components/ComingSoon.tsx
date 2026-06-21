import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Shared placeholder for screens that aren't part of the demo flow yet.
export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <div className="p-6">
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-brand">
          <Icon className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900">
          {title}
        </h1>
        <p className="mt-2 max-w-md text-sm text-zinc-500">{description}</p>
        <span className="mt-5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-500">
          Coming soon
        </span>
      </div>
    </div>
  );
}
