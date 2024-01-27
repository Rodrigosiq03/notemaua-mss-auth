import { User } from '../../../shared/domain/entities/user'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'

export class GetUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(ra: string) {
    if (!User.validateRa(ra)) {
      throw new EntityError('ra')
    }

    const user = await this.repo.getUser(ra)

    return user
  }
}