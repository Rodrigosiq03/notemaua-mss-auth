import { User } from '../../../shared/domain/entities/user'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'

export class GetUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(email: string) {

    const user = await this.repo.getUserByEmail(email)

    if (!user) {
      throw new NoItemsFound('this email')
    }

    return user
  }
}