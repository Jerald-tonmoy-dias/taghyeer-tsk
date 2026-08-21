"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/auth-provider";
import { isApiError } from "@/lib/api/error";

type FieldErrors = {
  phone?: string;
  name?: string;
};

/**
 * Require non-empty phone and name.
 * @param phone - Phone field
 * @param name - Name field
 * @returns FieldErrors
 */
function validateLogin(phone: string, name: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!phone.trim()) {
    errors.phone = "Enter your phone number";
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
      await login({ phone: phone.trim(), name: name.trim() });
      router.replace("/app");
    } catch (error) {
      setFormError(
        isApiError(error) ? error.message : "Could not log in. Try again.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-phone">Phone</Label>
        <Input
          id="login-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+15551234567"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? "login-phone-error" : undefined}
          disabled={pending}
        />
        {fieldErrors.phone ? (
          <p id="login-phone-error" className="text-sm text-destructive">
            {fieldErrors.phone}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-name">Name</Label>
        <Input
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
        />
        {fieldErrors.name ? (
          <p id="login-name-error" className="text-sm text-destructive">
            {fieldErrors.name}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Continue"}
      </Button>
    </form>
  );
}
