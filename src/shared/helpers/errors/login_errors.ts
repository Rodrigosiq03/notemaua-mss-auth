import { BaseError } from './base_error'

export class PasswordDoesNotMatchError extends BaseError {
  constructor() {
    super('Password does not match')
  }
}

export class FirstAccessAlreadyDoneError extends BaseError {
  constructor() {
    super('First access already done')
  }
}