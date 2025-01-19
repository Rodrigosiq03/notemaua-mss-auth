import { UserNotAuthenticated } from '../../../shared/helpers/errors/controller_errors'
import { ForbiddenAction } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { InternalServerError, OK, Unauthorized } from '../../../shared/helpers/external_interfaces/http_codes'
import { DeleteUserUsecase } from './delete_user_usecase'

export class DeleteUserController {
  constructor(private readonly usecase: DeleteUserUsecase) {}

  async handle(request: IRequest) {
    try {
      const auth = request.data.Authorization

      console.log('DELETE USER CONTROLLER, auth: ', auth)

      if (!auth) throw new ForbiddenAction('this user')
      if (typeof auth !== 'string') throw new ForbiddenAction('this user')

      const accessToken = auth.split(' ')[1]

      const userDeleted  = await this.usecase.execute(accessToken)

      return new OK({ isUserDeleted: userDeleted.is_user_deleted })

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