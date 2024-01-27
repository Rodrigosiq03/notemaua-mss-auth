import { it, expect, describe,  } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { GetUserUsecase } from '../../../../src/modules/get_user/app/get_user_usecase'
import { GetUserController } from '../../../../src/modules/get_user/app/get_user_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'

describe('Assert Get User controller is correct at all', () => {
  it('Assert Get User controller is correct when creating', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new GetUserUsecase(repo)
    const controller = new GetUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: '22.00000-0' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body['ra']).toEqual('22.00000-0')
    expect(response?.body['name']).toEqual('user1')
    expect(response?.body['email']).toEqual('22.00000-0@maua.br')
    expect(response?.body['role']).toEqual('STUDENT')
    expect(response?.body['message']).toEqual('The user was retrieved successfully')

  })
  it('Assert Get User controller is not correct when not pass ra', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new GetUserUsecase(repo)
    const controller = new GetUserController(usecase)

    const request = new HttpRequest(undefined, undefined, {})

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra is missing')
  })
  it('Assert Get User controller is not correct when pass ra with wrong type', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new GetUserUsecase(repo)
    const controller = new GetUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: 10 })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra isn\'t in the right type.\n Received: number.\n Expected: string.')
  })
  it('Assert Get User controller is not correct when pass a not found ra value', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new GetUserUsecase(repo)
    const controller = new GetUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: '22.00680-0' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(404)
    expect(response?.body).toBe('No items found for ra')
  })
})