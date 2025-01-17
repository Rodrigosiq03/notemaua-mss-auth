import { UserNotAuthenticated } from '../../../shared/helpers/errors/controller_errors'
import { ForbiddenAction } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { InternalServerError, OK, Unauthorized } from '../../../shared/helpers/external_interfaces/http_codes'
import { CreateUserOAuthUsecase } from './create_user_oauth_usecase'

export class CreateUserOAuthController {
  constructor(private readonly usecase: CreateUserOAuthUsecase) {}

  async handle(request: IRequest) {
    try {
      const auth = request.data.Authorization

      if (!auth) throw new ForbiddenAction('user')
      if (typeof auth !== 'string') throw new ForbiddenAction('user')

      const accessToken = auth.split(' ')[1]

      const token = await this.usecase.execute(accessToken)

      return new OK({ token })

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