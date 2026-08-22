"use client";

import { useAuth } from "@/features/auth/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type LogoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Confirm before clearing the session.
 * @param props.open - Whether the dialog is visible
 * @param props.onOpenChange - Open-state setter
 * @returns JSX.Element
 */
export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const { logout } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-sm gap-4 rounded-2xl border border-landing-border bg-landing-surface p-6 text-landing-ink shadow-2xl sm:max-w-sm"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <div>
            <DialogTitle className="font-landing-display text-lg font-semibold leading-tight text-landing-ink">
              Log out of Taghyeer?
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-relaxed text-landing-muted">
              You will be signed out of this session. Log back in with your
              phone number.
            </DialogDescription>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              logout();
            }}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-rose-500/20 transition-all hover:bg-rose-700 active:scale-95"
          >
            Confirm Log out
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
