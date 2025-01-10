import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { OK } from '../../../shared/helpers/external_interfaces/http_codes'

export class HealthCheckController {
  handle() {
    return new OK({ message: 'Health Check OK' })
  }
}