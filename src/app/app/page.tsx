import Link from "next/link";

export default function ChatPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Chat</h1>
      <p className="text-zinc-600">
        Inbox and thread UI will live here. For now this is a route
        placeholder.
      </p>
      <Link href="/login" className="text-sm text-zinc-700 underline">
        Back to login
      </Link>
    </main>
  );
}
