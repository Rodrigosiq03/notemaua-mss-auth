import { it, expect, describe } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { LoginUsecase } from '../../../../src/modules/login/app/login_usecase'
import { LoginController } from '../../../../src/modules/login/app/login_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'
import { EntityError } from '../../../../src/shared/helpers/errors/domain_errors'
import { MissingParameters, WrongTypeParameters } from '../../../../src/shared/helpers/errors/controller_errors'
import { PasswordDoesNotMatchError } from '../../../../src/shared/helpers/errors/login_errors'

describe('Assert Login controller is correct at all', () => {
  it('Should login a user correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)
    const controller = new LoginController(usecase)

    const request = new HttpRequest({ email: '22.00000-0@maua.br', password: 'Teste123$' }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body).toHaveProperty('token')
    expect(response?.body['message']).toEqual('User logged in successfully')
  })
  it('Should not login a user with wrong password', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)
    const controller = new LoginController(usecase)

    const request = new HttpRequest({ email: '22.00000-0@maua.br', password: 'Teste123' }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toEqual(new PasswordDoesNotMatchError().message)
  })
  it('Should not login a user with wrong email', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)
    const controller = new LoginController(usecase)

    const request = new HttpRequest({ email: '22.00000-0', password: 'Teste123$' }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toEqual(new EntityError('email').message)
  })
  it('Should not login a user with wrong typeof email', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)
    const controller = new LoginController(usecase)

    const request = new HttpRequest({ email: 1, password: 'Teste123$' }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toEqual(new WrongTypeParameters('email', 'string', 'number').message)
  })
  it('Should not login a user with wrong typeof password', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)
    const controller = new LoginController(usecase)

    const request = new HttpRequest({ email: '22.00000-0@maua.br', password: 1 }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toEqual(new WrongTypeParameters('password', 'string', 'number').message)
  })
  it('Should not login a user when not pass email', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)
    const controller = new LoginController(usecase)

    const request = new HttpRequest({ password: 'Teste123$' }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toEqual(new MissingParameters('email').message)
  })
  it('Should not login a user when not pass password', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)
    const controller = new LoginController(usecase)

    const request = new HttpRequest({ email: '22.00000-0@maua.br' }, undefined, undefined)

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toEqual(new MissingParameters('password').message)
  })

})