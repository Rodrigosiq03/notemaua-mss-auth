import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { User } from '../../../shared/domain/entities/user'
import { TokenAuth } from '../../../shared/helpers/external_interfaces/token_auth'
import {
  MissingParameters,
  UserNotAllowed,
  UserNotAuthenticated,
} from '../../../shared/helpers/errors/controller_errors'
import { ROLE } from '../../../shared/domain/enums/role_enum'
import { v4 as uuid } from 'uuid'

export class OAuthUserUsecase {
  public token_auth: TokenAuth
  public database_repo: IUserRepository

  constructor(database_repo: IUserRepository) {
    this.token_auth = new TokenAuth()
    this.database_repo = database_repo
  }

  public async execute(
    auth_code: string,
    code_verifier: string,
    redirect_uri: string,
  ): Promise<{ token: string; is_user_created: boolean, created_user: User | undefined }> {
    const access_token = await this.token_auth
      .get_access_token(auth_code, code_verifier, redirect_uri)
      .catch((error) => {
        throw new UserNotAuthenticated(error.message)
      })

    const token_response = await this.token_auth.verify_azure_token(
      access_token,
    )

    const padrao: RegExp = /@maua\.br$/
    if (!padrao.test(token_response.mail)) {
      throw new UserNotAllowed('Invalid Email, must be a maua.br domain.')
    }
    let user = await this.database_repo.getUserByEmail(token_response.mail)

    
    if (!user) {
      user = new User({
        id: uuid(),
        ra: token_response.mail.split('@')[0],
        name: token_response.displayName,
        email: token_response.mail,
        role: ROLE.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await this.database_repo.createUser(user)
    }
    
    const token =  await this.token_auth.generate_token(user.email, user.name)
    return {
      token,
      is_user_created: !user ? true : false,
      created_user: user,
    }
  }
}
