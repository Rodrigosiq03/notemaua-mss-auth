/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, InternalServerError, NotFound, OK } from '../../../shared/helpers/external_interfaces/http_codes'
import { UpdateUserUsecase } from './update_user_usecase'
import { UpdateUserViewmodel } from './update_user_viewmodel'

export class UpdateUserController {
  constructor(private usecase: UpdateUserUsecase) {}

  async handle(request: IRequest) {
    try {
      if (!request.data.ra) {
        throw new MissingParameters('ra')
      }
      if (typeof request.data.ra !== 'string') {
        throw new WrongTypeParameters('ra', 'string', typeof request.data.ra) 
      }

      if (request.data.name && typeof request.data.name !== 'string') {
        throw new WrongTypeParameters('name', 'string', typeof request.data.name)
      }

      if (request.data.email && typeof request.data.email !== 'string') {
        throw new WrongTypeParameters('email', 'string', typeof request.data.email)
      }

      if (request.data.password && typeof request.data.password !== 'string') {
        throw new WrongTypeParameters('password', 'string', typeof request.data.password)
      }

      const { ra, name, email, password } = request.data

      const user = await this.usecase.execute(ra as any, name as any, email as any, password as any)
      const viewmodel = new UpdateUserViewmodel(user)

      if (!name && !email && password) {
        const response = new OK(viewmodel.toJSON(true))

        return response
      }

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