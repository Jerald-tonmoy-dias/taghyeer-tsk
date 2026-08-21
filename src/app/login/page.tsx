import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          Taghyeer
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Log in</h1>
        <p className="text-muted-foreground">
          Use your phone and name. A new phone creates an account.
        </p>
      </div>
      <LoginForm />
      <Link href="/" className="text-sm text-muted-foreground underline">
        Back home
      </Link>
    </main>
  );
}
