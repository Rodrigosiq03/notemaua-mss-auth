import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { UpdateUserUsecase } from '../../../../src/modules/update_user/app/update_user_usecase'
import { UpdateUserController } from '../../../../src/modules/update_user/app/update_user_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'

describe('Assert Update User controller is correct at all', () => {
  const decoded = {
    role: 'STUDENT',
  }
  it('Should retrieve update controller with all parameters to update correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new UpdateUserUsecase(repo)
    const controller = new UpdateUserController(usecase)

    const request = new HttpRequest({ password: 'Megan309013$' }, undefined, { ra: '22.00000-0' })

    const response = await controller.handle(request, decoded)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body['ra']).toEqual('22.00000-0')
    expect(response?.body['name']).toEqual('user1')
    expect(response?.body['email']).toEqual('22.00000-0@maua.br')
    expect(response?.body['role']).toEqual('STUDENT')
    expect(response?.body['message']).toEqual('Your password was updated successfully')
  })
  it('Should throw 400 statusCode when not pass ra', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new UpdateUserUsecase(repo)
    const controller = new UpdateUserController(usecase)
    
    const request = new HttpRequest({ password: 'Teste123$' }, undefined, undefined)
    
    const response = await controller.handle(request, decoded)
    
    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra is missing')
  })
  it('Should update correctly when pass password and ra', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new UpdateUserUsecase(repo)
    const controller = new UpdateUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: '22.00000-0', password: 'Rodrigo0301$' })

    const response = await controller.handle(request, decoded)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body['ra']).toEqual('22.00000-0')
    expect(response?.body['name']).toEqual('user1')
    expect(response?.body['email']).toEqual('22.00000-0@maua.br')
    expect(response?.body['role']).toEqual('STUDENT')
    expect(response?.body['message']).toEqual('Your password was updated successfully')
  })
  it('Should throw 404 statusCode when not found user', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new UpdateUserUsecase(repo)
    const controller = new UpdateUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: '22.33333-2', password: 'Teste123$'})

    const response = await controller.handle(request, decoded)

    expect(response?.statusCode).toEqual(404)
    expect(response?.body).toBe('No items found for ra')
  })
})
