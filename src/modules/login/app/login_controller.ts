import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { LoginUsecase } from './login_usecase'
import { LoginViewmodel } from './login_viewmodel'
import jsonwebtoken from 'jsonwebtoken'
import envs from '../../../../index'
import { BadRequest, InternalServerError, NotFound, OK } from '../../../shared/helpers/external_interfaces/http_codes'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { sendFirstAccessMail } from '../../../shared/services/send_mail'

export class LoginController {
  constructor(private usecase: LoginUsecase) {}

  async handle(request: IRequest) {
    try {
      if (request.data.email === undefined) {
        throw new MissingParameters('email')
      }
      if (typeof request.data.email !== 'string') {
        throw new WrongTypeParameters('email', 'string', typeof request.data.email)
      }
      if (request.data.password === undefined) {
        throw new MissingParameters('password')
      }
      if (typeof request.data.password !== 'string') {
        throw new WrongTypeParameters('password', 'string', typeof request.data.password)
      }

      const user = await this.usecase.execute(request.data.email, request.data.password)

      if (request.data.password === envs.FIRST_ACCESS_PASSWORD) {
        sendFirstAccessMail()
      }

      const jwtSecret = envs.JWT_SECRET

      const token = jsonwebtoken.sign({ user: JSON.stringify(user)}, jwtSecret, 
        {
          expiresIn: '24h'
        })

      const viewmodel = new LoginViewmodel(token)

      const response = new OK(viewmodel.toJSON())

      return response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message)
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message)
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message)
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message)
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }
    }
  }
}