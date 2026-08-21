"use client";

import type { ReactNode } from "react";
import { RedirectIfSignedIn } from "@/features/auth/redirect-if-signed-in";

/**
 * Keep signed-in users off the login page.
 * @param props.children - Login page
 * @returns JSX.Element
 */
export default function LoginLayout({ children }: { children: ReactNode }) {
  return <RedirectIfSignedIn>{children}</RedirectIfSignedIn>;
}
