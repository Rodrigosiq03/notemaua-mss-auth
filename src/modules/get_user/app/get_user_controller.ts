/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ForbiddenAction, NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, InternalServerError, NotFound, OK } from '../../../shared/helpers/external_interfaces/http_codes'
import { GetUserUsecase } from './get_user_usecase'
import { GetUserViewmodel } from './get_user_viewmodel'

export class GetUserController {
  constructor(private usecase: GetUserUsecase) {}

  async handle(request: IRequest) {
    try {

      const auth = request.data.Authorization

      if (!auth) throw new ForbiddenAction('this user')

      if (typeof auth !== 'string') throw new ForbiddenAction('this user')

      const token = auth.split(' ')[1]

      const user = await this.usecase.execute(token)

      const viewmodel = new GetUserViewmodel(user)

      const response = new OK(viewmodel.toJSON())

      return response
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