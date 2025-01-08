import { BaseError } from './base_error'

export class MissingParameters extends BaseError {
  constructor(message: string) {
    super(`Field ${message} is missing`)
  }
}

export class WrongTypeParameters extends BaseError {
  constructor(fieldName: string, fieldTypeExpected: string, fieldTypeReceived: string) {
    super(`Field ${fieldName} isn't in the right type.\n Received: ${fieldTypeReceived}.\n Expected: ${fieldTypeExpected}.`)
  }
}

export class UserNotAuthenticated extends BaseError {
  constructor(message?: string) {
      if (message) {
          super(message);
      } else {
          super("User not authentificated");
      }
  }
}

export class UserNotAllowed extends BaseError {
  constructor(message?: string) {
      if (message) {
          super(message);
      } else {
          super("User not allowed");
      }
  }
}