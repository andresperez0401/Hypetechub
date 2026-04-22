/**
 * Base class for all domain-level errors.
 * Carry an HTTP status so the global filter can map them without
 * leaking HTTP knowledge into individual use cases.
 */
export class DomainException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    /** HTTP status code this error maps to (default 422 Unprocessable Entity). */
    public readonly httpStatus: number = 422,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}
