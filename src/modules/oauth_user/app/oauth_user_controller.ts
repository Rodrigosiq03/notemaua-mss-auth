import { OAuthUserUsecase } from './oauth_user_usecase'

import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, Created, Forbidden, InternalServerError, OK } from '../../../shared/helpers/external_interfaces/http_codes'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { MissingParameters, UserNotAllowed } from '../../../shared/helpers/errors/controller_errors'


export class OAuthUserController {
  usecase: OAuthUserUsecase

  constructor(usecase: OAuthUserUsecase) {
    this.usecase = usecase
  }
  async handle(request: IRequest)  {
    try {
      if (!request) {
        throw new MissingParameters('Request')
      }

      const token: string = request.data.token as string

      const response = await this.usecase.execute(token)

      if (response.created_user) {
        return new Created({token: response.token})
      }
      return new OK({token: response.token})     

    } catch (error: any) {
      if (error instanceof EntityError) {
        return new BadRequest(error.message)
      }
      if (error instanceof UserNotAllowed) {
        return new Forbidden(error)
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message)
      }
      return new InternalServerError(error.message)
    }
  }
}