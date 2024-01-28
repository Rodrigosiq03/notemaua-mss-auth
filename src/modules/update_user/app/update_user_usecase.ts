import { User } from '../../../shared/domain/entities/user'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class UpdateUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(ra: string, newName?: string, newEmail?: string, newPassword?: string): Promise<User> {
    let user = undefined

    if (!User.validateRa(ra)) {
      throw new EntityError('ra')
    }
    if (newName && !User.validateName(newName)) {
      throw new EntityError('name')
    }

    if (newEmail && !User.validateEmail(newEmail)) {
      throw new EntityError('email')
    }

    if (newPassword && !User.validatePassword(newPassword)) {
      throw new EntityError('password')
    }

    switch (true) {
      case !!newName && !!newEmail && !!newPassword:
        user = await this.repo.updateUser(ra, newName, newEmail, newPassword)
        break
      case !!newName && !!newEmail:
        user = await this.repo.updateUser(ra, newName, newEmail)
        break
      case !!newName && !!newPassword:
        user = await this.repo.updateUser(ra, newName, undefined, newPassword)
        break
      case !!newEmail && !!newPassword:
        user = await this.repo.updateUser(ra, undefined, newEmail, newPassword)
        break
      case !!newName:
        user = await this.repo.updateUser(ra, newName)
        break
      case !!newEmail:
        user = await this.repo.updateUser(ra, undefined, newEmail)
        break
      case !!newPassword:
        user = await this.repo.updateUser(ra, undefined, undefined, newPassword)
        break
      default:
        throw new Error('No data to update')
    }

    return user
  }
}