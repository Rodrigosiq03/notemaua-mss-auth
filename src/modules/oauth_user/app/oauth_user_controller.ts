import { OAuthUserUsecase } from './oauth_user_usecase'

import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, Created, Forbidden, InternalServerError, OK, Unauthorized } from '../../../shared/helpers/external_interfaces/http_codes'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { MissingParameters, UserNotAllowed, UserNotAuthenticated, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'


export class OAuthUserController {
  usecase: OAuthUserUsecase

  constructor(usecase: OAuthUserUsecase) {
    this.usecase = usecase
  }
  async handle(request: IRequest)  {
    try {
      const authCode: string = request.data.authCode as string
      const codeVerifier = request.data.codeVerifier as string
      const redirectUri: string = request.data.redirectUri as string

      if (!authCode) throw new MissingParameters('authCode')
      if (!codeVerifier) throw new MissingParameters('codeVerifier')
      if (!redirectUri) throw new MissingParameters('redirectUri')

      if (typeof authCode !== 'string') throw new WrongTypeParameters('authCode', 'string', typeof authCode)
      if (typeof codeVerifier !== 'string') throw new WrongTypeParameters('codeVerifier', 'string', typeof codeVerifier)
      if (typeof redirectUri !== 'string') throw new WrongTypeParameters('redirectUri', 'string', typeof redirectUri)

      const response = await this.usecase.execute(authCode, codeVerifier, redirectUri)

      console.log('RESPONSE: ', response)

      if (response.is_user_created) {
        return new Created({token: response.token, created_user: response.created_user, message: 'User has been created successfully'})
      }
      return new OK({token: response.token})    
    } catch (error: any) {
      if (error instanceof EntityError) {
        return new BadRequest(error.message)
      }
      if (error instanceof UserNotAllowed) {
        return new Forbidden(error)
      }
      if (error instanceof UserNotAuthenticated) {
        return new Unauthorized(error.message)
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message)
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message)
      }
      return new InternalServerError(error.message)
    }
  }
}