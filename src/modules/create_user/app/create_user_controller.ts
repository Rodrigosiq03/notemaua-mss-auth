/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ForbiddenAction, NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, Created, Forbidden, InternalServerError, NotFound } from '../../../shared/helpers/external_interfaces/http_codes'
import { CreateUserUsecase } from './create_user_usecase'
import { CreateUserViewmodel } from './create_user_viewmodel'

export class CreateUserController {
  constructor(private usecase: CreateUserUsecase) {}

  async handle(request: IRequest) {
    try {
      if (request.data.ra === undefined || request.data.ra === null) {
        throw new MissingParameters('ra')
      }
      if (typeof request.data.ra !== 'string') {
        throw new WrongTypeParameters('ra', 'string', typeof request.data.ra)
      }

      const user = await this.usecase.execute(request.data.ra)

      const viewmodel = new CreateUserViewmodel(user)

      const response = new Created(viewmodel.toJSON())

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
      if (error instanceof ForbiddenAction) {
        return new Forbidden(error.message as any)
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }
    }
  }
}