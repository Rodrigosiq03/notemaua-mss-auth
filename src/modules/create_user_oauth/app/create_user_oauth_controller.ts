import { UserNotAuthenticated } from '../../../shared/helpers/errors/controller_errors'
import { ForbiddenAction } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { Created, InternalServerError, OK, Unauthorized } from '../../../shared/helpers/external_interfaces/http_codes'
import { CreateUserOAuthUsecase } from './create_user_oauth_usecase'

export class CreateUserOAuthController {
  constructor(private readonly usecase: CreateUserOAuthUsecase) {}

  async handle(request: IRequest) {
    try {
      const auth = request.data.Authorization

      console.log('CREATE USER OAUTH CONTROLLER, auth: ', auth)

      if (!auth) throw new ForbiddenAction('user')
      if (typeof auth !== 'string') throw new ForbiddenAction('user')

      const accessToken = auth.split(' ')[1]

      const credentials = await this.usecase.execute(accessToken)

      if (!credentials) {
        return new Unauthorized('User not authenticated')
      }

      if (credentials.is_user_created) {
        return new Created( { token: credentials.token, createdUser: credentials.created_user} )
      }

      return new OK({ token: credentials.token })

    } catch(error: any) {
      if (error instanceof UserNotAuthenticated) {
        return new Unauthorized(error.message)
      }
      if (error instanceof ForbiddenAction) {
        return new Unauthorized(error.message)
      }

      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }

    }
  }
}