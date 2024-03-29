/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ForbiddenAction, NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
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
      if (!request.data.password) {
        throw new MissingParameters('password')
      }
      if (typeof request.data.password !== 'string') {
        throw new WrongTypeParameters('password', 'string', typeof request.data.password)
      }

      const { ra, password } = request.data

      const updatedUser = await this.usecase.execute(ra, password)
      const viewmodel = new UpdateUserViewmodel(updatedUser)

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