import { BaseError } from './base_error'

export class FailureSendingEmailError extends BaseError {
  constructor() {
    super('Failure on sending email')
  }
}