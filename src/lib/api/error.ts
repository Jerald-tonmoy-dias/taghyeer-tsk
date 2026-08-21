import type { ApiErrorBody, ApiErrorCode } from "@/lib/types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: { path: string; message: string }[];

  constructor(options: {
    message: string;
    status: number;
    code: ApiErrorCode;
    details?: { path: string; message: string }[];
  }) {
    super(options.message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }

  get isAuthError(): boolean {
    return this.code === "NO_TOKEN" || this.code === "INVALID_TOKEN";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function parseApiError(status: number, body: unknown): ApiError {
  const envelope = body as ApiErrorBody | null;
  const error = envelope?.error;

  return new ApiError({
    status,
    message: error?.message ?? `Request failed with status ${status}`,
    code: error?.code ?? "UNKNOWN",
    details: error?.details,
  });
}
