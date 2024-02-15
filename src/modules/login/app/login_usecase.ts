import { compare } from 'bcryptjs'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { User } from '../../../shared/domain/entities/user'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'

export class LoginUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(email: string, password: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError('email')
    }
    const user = await this.repo.login(email)

    if (user.password === undefined) {
      throw new NoItemsFound('password')
    }

    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new Error('Password does not match')
    }

    return user
  }
}