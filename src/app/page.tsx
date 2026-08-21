import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6">
      <p className="text-sm uppercase tracking-wide text-zinc-500">Taghyeer</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        Real-time 1:1 and group chat
      </h1>
      <p className="text-zinc-600">
        Landing page comes later. The app is being built next.
      </p>
      <Link
        href="/login"
        className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Go to login
      </Link>
    </main>
  );
}
