export class ExternalAuthError extends Error {
  constructor(public readonly code: "INVALID_PROVIDER" | "INVALID_CODE") {
    super(code);
    this.name = "ExternalAuthError";
  }
}
