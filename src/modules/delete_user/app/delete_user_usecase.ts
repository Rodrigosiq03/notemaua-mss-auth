import { envs } from '../../../..'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import jwt from 'jsonwebtoken'
import { ForbiddenAction } from '../../../shared/helpers/errors/usecase_errors'

export class DeleteUserUsecase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(token: string) {

    const secret = envs.SECRET_KEY

    const decode = jwt.verify(token, secret)

    if (!decode) throw new ForbiddenAction('this user')

    if (typeof decode !== 'object') throw new ForbiddenAction('this user')

    const email = decode.user.email

    const userExists = await this.repository.getUserByEmail(email)

    if (!userExists) throw new ForbiddenAction('this user')
    
    await this.repository.deleteUser(email)

    return { is_user_deleted: true }
  }
}