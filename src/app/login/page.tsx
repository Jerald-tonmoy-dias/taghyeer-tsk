import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="text-zinc-600">
        Phone and name sign-in will live here. For now this is a route
        placeholder.
      </p>
      <div className="flex gap-3 text-sm">
        <Link href="/" className="text-zinc-700 underline">
          Home
        </Link>
        <Link href="/app" className="text-zinc-700 underline">
          Open chat
        </Link>
      </div>
    </main>
  );
}
