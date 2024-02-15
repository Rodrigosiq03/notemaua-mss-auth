import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'
import { CreateUserUsecase } from '../../../../src/modules/create_user/app/create_user_usecase'
import { CreateUserController } from '../../../../src/modules/create_user/app/create_user_controller'

describe('Assert Create User controller is correct at all', () => {
  it('Should activate controller correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(undefined, undefined, { ra: '22.00680-0' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(201)
    expect(response?.body['ra']).toEqual('22.00680-0')
    expect(response?.body['name']).toEqual('Rodrigo Diana Siqueira')
    expect(response?.body['email']).toEqual('22.00680-0@maua.br')
    expect(response?.body['role']).toEqual('STUDENT')
  })
  it('Should throw 400 statusCode when not pass ra', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(undefined, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra is missing')
  })
  it('Should throw 400 statusCode when pass ra incorrect type', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest({ ra: 100103 }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field ra isn\'t in the right type.\n Received: number.\n Expected: string.')
  })
  it('Should throw 404 statusCode when pass invalid ra', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)
    
    const request = new HttpRequest(undefined, undefined, { ra: '22.00000-0' })
    
    const response = await controller.handle(request)
    
    expect(response?.statusCode).toEqual(403)
    expect(response?.body).toBe('The action is forbidden for this ra')
  })
  
})
