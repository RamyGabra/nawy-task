/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error - for client input validation failures
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Not found error - for resource not found scenarios
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

