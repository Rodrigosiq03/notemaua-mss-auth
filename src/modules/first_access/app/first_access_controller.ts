import envs from '../../../..'
import { STAGE } from '../../../shared/domain/enums/stage_enum'
import { MissingParameters, WrongTypeParameters } from '../../../shared/helpers/errors/controller_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ForbiddenAction, NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { BadRequest, Forbidden, InternalServerError, NotFound, OK } from '../../../shared/helpers/external_interfaces/http_codes'
import { sendFirstAccessMail } from '../../../shared/services/send_mail'
import { FirstAccessUsecase } from './first_access_usecase'
import { FirstAccessViewmodel } from './first_access_viewmodel'

export class FirstAccessController  {
  constructor(private usecase: FirstAccessUsecase) {}

  async handle(request: IRequest) {
    try {
      if (request.data.ra === undefined || request.data.ra === null) {
        throw new MissingParameters('ra')
      }
      if (typeof request.data.ra !== 'string') {
        throw new WrongTypeParameters('ra', 'string', typeof request.data.ra)
      }

      const user = await this.usecase.execute(request.data.ra)

      if (user.password && envs.STAGE === STAGE.DEV) sendFirstAccessMail(user.ra, user.password)

      const viewmodel = new FirstAccessViewmodel()

      const response = new OK(viewmodel.toJSON())

      return response
    }
    catch (error: any) {
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