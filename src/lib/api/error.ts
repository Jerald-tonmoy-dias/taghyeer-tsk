import type { ApiErrorBody, ApiErrorCode } from "@/lib/types";

/** Typed API failure from the `{ error: { message, code } }` envelope. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly details?: { path: string; message: string }[];

  /**
   * Create an API error from a failed HTTP response.
   * @param options.message - Human-readable error
   * @param options.status - HTTP status
   * @param options.code - API `error.code`
   * @param options.details - Optional validation details
   * @returns ApiError
   */
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

  /**
   * Whether this error means the session is missing or invalid.
   * @returns boolean
   */
  get isAuthError(): boolean {
    return this.code === "NO_TOKEN" || this.code === "INVALID_TOKEN";
  }
}

/**
 * Type guard for `ApiError`.
 * @param error - Caught value
 * @returns boolean
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Build an `ApiError` from status + JSON body.
 * @param status - HTTP status
 * @param body - Parsed JSON or null
 * @returns ApiError
 */
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
