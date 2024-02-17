import { it, expect, describe,  } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { ForgotPasswordUsecase } from '../../../../src/modules/forgot_password/app/forgot_password_usecase'
import { ForgotPasswordController } from '../../../../src/modules/forgot_password/app/forgot_password_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'

describe('Assert Forgot password controller is correct at all', () => {
  const repo = new UserRepositoryMock()
  const usecase = new ForgotPasswordUsecase(repo)
  const controller = new ForgotPasswordController(usecase)
  it('Assert Forgot password controller is correct when creating', async () => {

    const request = new HttpRequest(undefined, undefined, { email: '22.00000-0@maua.br' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(200)
    expect(response?.body['message']).toEqual('A code has been sent to your email. Please check it.')
    expect(response?.headers).toHaveProperty('createdAt')

  })
  it('Assert Forgot password controller is not correct when not pass ra', async () => {
    const request = new HttpRequest(undefined, undefined, {})

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field email is missing')
  })
  it('Assert Forgot password controller is not correct when pass ra with wrong type', async () => {
    const request = new HttpRequest(undefined, undefined, { email: 10 })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field email isn\'t in the right type.\n Received: number.\n Expected: string.')
  })
  it('Assert Forgot password controller is not correct when pass a not found ra value', async () => {
    

    const request = new HttpRequest(undefined, undefined, { email: '22.00680-0@maua.br' })

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(404)
    expect(response?.body).toBe('No items found for ra')
  })
})