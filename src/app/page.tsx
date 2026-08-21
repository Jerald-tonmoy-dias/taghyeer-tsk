import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6">
      <p className="text-sm uppercase tracking-wide text-muted-foreground">
        Taghyeer
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        Real-time 1:1 and group chat
      </h1>
      <p className="text-muted-foreground">
        Landing page comes later. The app is being built next.
      </p>
      <Button asChild className="w-fit">
        <Link href="/login">Go to login</Link>
      </Button>
    </main>
  );
}
