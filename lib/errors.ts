export class AppError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}

export class HttpError extends AppError {
  readonly status: number;

  constructor(status: number, code: string, message: string) {
    super(code, message);
    this.name = "HttpError";
    this.status = status;
  }
}
