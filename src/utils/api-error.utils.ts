interface IApiError {
  statusCode: number;
  message: string;
  success: false;
  errors: string[];
}

class ApiError extends Error implements IApiError {
  public readonly statusCode: number;
  public readonly success: false = false;
  public readonly errors: string[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong..",
    errors: string[] = []
  ) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }
}

export { ApiError };