import { User } from '../../../shared/domain/entities/user'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class ConfirmForgotPasswordUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(email: string, newPassword: string, createdAt: number) {
    if (!User.validateEmail(email)) {
      throw new EntityError('email')
    }
    if (!User.validatePassword(newPassword)) {
      throw new EntityError('newPassword')
    }

    const timestampNow = new Date().getTime()

    if (timestampNow - createdAt > 600000) {
      throw new EntityError('expiredToken')
    }

    const updatedUser = await this.repo.confirmForgotPassword(email, newPassword)

    return updatedUser
  }
}