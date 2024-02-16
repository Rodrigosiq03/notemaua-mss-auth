import { it, expect, describe,  } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { FirstAccessUsecase } from '../../../../src/modules/first_access/app/first_access_usecase'
import { FirstAccessController } from '../../../../src/modules/first_access/app/first_access_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'

describe('Assert First access controller is correct at all', () => {
  const repo = new UserRepositoryMock()
  const usecase = new FirstAccessUsecase(repo)
  const controller = new FirstAccessController(usecase)

  it('Assert First access controller is correct when creating', async () => {

    const request = new HttpRequest(undefined, undefined, { ra: '22.00000-0' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body['message']).toEqual('A new password has been sent to your email. Please check it.')

  })
  it('Assert First access controller is not correct when not pass ra', async () => {
    const request = new HttpRequest(undefined, undefined, {})

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra is missing')
  })
  it('Assert First access controller is not correct when pass ra with wrong type', async () => {
    const request = new HttpRequest(undefined, undefined, { ra: 10 })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra isn\'t in the right type.\n Received: number.\n Expected: string.')
  })
  it('Assert First access controller is not correct when pass a not found ra value', async () => {
    

    const request = new HttpRequest(undefined, undefined, { ra: '22.00680-0' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(404)
    expect(response?.body).toBe('No items found for ra')
  })
})