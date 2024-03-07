import { User } from '../../../shared/domain/entities/user'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class UpdateUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(ra: string, newPassword: string): Promise<User> {
    let user = undefined

    if (!User.validateRa(ra)) {
      throw new EntityError('ra')
    }

    if (!User.validatePassword(newPassword)) {
      throw new EntityError('password')
    }

    user = await this.repo.updateUser(ra, newPassword)

    return user
  }
}