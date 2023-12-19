export class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }

export class ValidationError extends CustomError {
    constructor(message: string) {
      super(message);
    }
  }

export class NotFoundError extends CustomError {
    constructor(message: string) {
      super(message);
    }
  }

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
      super(message);
    }
  }

export class RequiredParameterError extends CustomError {
    constructor(message: string) {
      super(message);
    }
  }

export class InvalidPropertyError extends CustomError {
    constructor(message: string) {
      super(message);
    }
  }

export class UniqueConstraintError extends CustomError {
    constructor(message: string) {
      super(message);
    }
  }

  
