import { it, expect, describe } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { ForgotPasswordUsecase } from '../../../../src/modules/forgot_password/app/forgot_password_usecase'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert Forgot password usecase is correct at all', () => {
  it('Should Forgot password usecase correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new ForgotPasswordUsecase(repo)

    const user = await usecase.execute('22.00000-0@maua.br')

    expect(user.props).toEqual({
      ra: '22.00000-0',
      name: 'user1',
      email: '22.00000-0@maua.br',
      role: ROLE.STUDENT,
      password: '$2a$06$eZD/Cu7rW77o.FM1EsEne.pHe9IQOeVICkbbtrXZkJjJh8rih1nJ.',
    })
  })
  
})