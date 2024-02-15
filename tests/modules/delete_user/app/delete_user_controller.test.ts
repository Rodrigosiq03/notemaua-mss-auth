import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { DeleteUserUsecase } from '../../../../src/modules/delete_user/app/delete_user_usecase'
import { DeleteUserController } from '../../../../src/modules/delete_user/app/delete_user_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'

describe('Assert Delete User controller is correct at all', () => {
  it('Assert Get User controller is correct when creating', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new DeleteUserUsecase(repo)
    const controller = new DeleteUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: '22.00000-0' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body['ra']).toEqual('22.00000-0')
    expect(response?.body['message']).toEqual('The user was deleted successfully')

  })
  it('Assert Get User controller is not correct when not pass id', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new DeleteUserUsecase(repo)
    const controller = new DeleteUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: undefined })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra is missing')
  })
})