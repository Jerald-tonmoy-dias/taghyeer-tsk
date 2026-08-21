import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
      <p className="text-muted-foreground">
        Phone and name sign-in will live here. For now this is a route
        placeholder.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app">Open chat</Link>
        </Button>
      </div>
    </main>
  );
}
