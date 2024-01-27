import { compare } from 'bcryptjs'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { User } from '../../../shared/domain/entities/user'

export class LoginUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(email: string, password: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError('email')
    }
    const user = await this.repo.login(email)

    const doesPasswordMatches = await compare(password, user.password)

    if (!doesPasswordMatches) {
      throw new EntityError('password')
    }

    return user
  }
}