import { User } from '../../../shared/domain/entities/user'
import { ROLE } from '../../../shared/domain/enums/role_enum'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { ForbiddenAction } from '../../../shared/helpers/errors/usecase_errors'
import { TokenAuth } from '../../../shared/helpers/external_interfaces/token_auth'
import { v4 as uuid } from 'uuid'

export class CreateUserOAuthUsecase {
  constructor(private readonly database_repo: IUserRepository, private readonly token_auth: TokenAuth) {}

  async execute(accessToken: string) {
    console.log('CREATE USER OAUTH USECASE, accessToken: ', accessToken)
    const { displayName: name, mail: email } = await this.token_auth.verify_azure_token(accessToken)

    console.log('CREATE USER OAUTH USECASE, name: ', name)
    console.log('CREATE USER OAUTH USECASE, email: ', email)

    const raRegex = /^(\d{2}\.\d{5}-\d)$/
    if (raRegex.test(email.split('@')[0])) {
      throw new ForbiddenAction('this user')
    }

    let user = await this.database_repo.getUserByEmail(email)

    console.log('CREATE USER OAUTH USECASE, user: ', user)

    if (!user) {
      user = new User({
        id: uuid(),
        name,
        email,
        role: ROLE.EMPLOYEE,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      console.log('CREATE USER OAUTH USECASE, ENTROU PARA CRIAR O USUARIO')
      console.log(user)

      await this.database_repo.createUser(user)
    }
    
    const token = await this.token_auth.generate_token(email, name)
    console.log('CREATE USER OAUTH USECASE, token: ', token)
    return { token, created_user: user }

  }
}