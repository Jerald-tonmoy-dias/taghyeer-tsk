"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/auth-provider";
import { isApiError } from "@/lib/api/error";
import { isValidPhone, normalizePhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

type FieldErrors = {
  phone?: string;
  name?: string;
};

const fieldClass =
  "w-full rounded-xl border border-landing-border bg-landing-cream/70 py-3 pr-4 pl-10 text-sm font-medium text-landing-ink transition-all placeholder:text-landing-muted-light focus:border-landing-primary focus:bg-landing-surface focus:ring-4 focus:ring-landing-primary/10 focus:outline-none disabled:opacity-60";

/**
 * Require a numeric phone and a non-empty name.
 * @param phone - Phone field
 * @param name - Name field
 * @returns FieldErrors
 */
function validateLogin(phone: string, name: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!phone.trim()) {
    errors.phone = "Enter your phone number";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Enter a number";
  }
  if (!name.trim()) {
    errors.name = "Enter your name";
  }
  return errors;
}

/**
 * Phone + name form. New phones are registered by the API.
 * @returns JSX.Element
 */
export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validateLogin(phone, name);
    setFieldErrors(errors);
    setFormError(null);
    if (errors.phone || errors.name) {
      return;
    }

    setPending(true);
    try {
      await login({ phone: normalizePhone(phone), name: name.trim() });
      router.replace("/app");
    } catch (error) {
      setFormError(
        isApiError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : "Could not log in. Try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="login-phone"
          className="mb-1.5 block text-[11px] font-bold tracking-wider text-landing-muted uppercase"
        >
          Phone Number
        </label>
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-3.5 flex items-center text-landing-muted-light">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <input
            id="login-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="01712345678"
            inputMode="numeric"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "login-phone-error" : undefined}
            disabled={pending}
            className={cn(fieldClass, "font-landing-mono")}
          />
        </div>
        {fieldErrors.phone ? (
          <p id="login-phone-error" className="mt-1.5 text-sm text-destructive">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="login-name"
          className="mb-1.5 block text-[11px] font-bold tracking-wider text-landing-muted uppercase"
        >
          Your Name
        </label>
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-3.5 flex items-center text-landing-muted-light">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <input
            id="login-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "login-name-error" : undefined}
            disabled={pending}
            className={fieldClass}
          />
        </div>
        {fieldErrors.name ? (
          <p id="login-name-error" className="mt-1.5 text-sm text-destructive">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-landing-primary px-4 py-3.5 text-sm font-medium text-landing-surface shadow-md shadow-landing-primary/25 transition-all hover:bg-landing-primary-hover hover:shadow-lg hover:shadow-landing-primary/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span>{pending ? "Signing in…" : "Continue"}</span>
          {pending ? null : (
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
