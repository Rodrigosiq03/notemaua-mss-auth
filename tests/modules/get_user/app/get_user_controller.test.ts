import { it, expect, describe,  } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { GetUserUsecase } from '../../../../src/modules/get_user/app/get_user_usecase'
import { GetUserController } from '../../../../src/modules/get_user/app/get_user_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'

describe('Assert Get User controller is correct at all', () => {
  const decoded = {
    ra: '22.00000-0',
  }

  it('Assert Get User controller is correct when creating', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new GetUserUsecase(repo)
    const controller = new GetUserController(usecase)

    const request = new HttpRequest()


    const response = await controller.handle(request, decoded)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body['ra']).toEqual('22.00000-0')
    expect(response?.body['name']).toEqual('user1')
    expect(response?.body['email']).toEqual('22.00000-0@maua.br')
    expect(response?.body['role']).toEqual('STUDENT')
    expect(response?.body['message']).toEqual('The user was retrieved successfully')

  })
  
})