import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint text-brand">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>
    </div>
  );
}
