import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock' 
import { ConfirmForgotPasswordUsecase } from '../../../../src/modules/confirm_forgot_password/app/confirm_forgot_password_usecase'
import { User } from '../../../../src/shared/domain/entities/user'
import { EntityError } from '../../../../src/shared/helpers/errors/domain_errors'

describe('Assert Confirm Forgot Password Usecase is correct at all', () => {
  it('Should confirm forgot password correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new ConfirmForgotPasswordUsecase(repo)
    const user = await usecase.execute('22.00000-0@maua.br', 'Testenaosei123$', new Date().getTime())

    expect(user.ra).toEqual('22.00000-0')
    expect(user).toBeInstanceOf(User)
  })
  
})