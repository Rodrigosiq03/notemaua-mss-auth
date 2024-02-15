import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { STATE } from '../../../../src/shared/domain/enums/state_enum'
import { CreateUserUsecase } from '../../../../src/modules/create_user/app/create_user_usecase'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert Create User usecase is correct at all', () => {
  it('Should activate usecase correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)

    const user = await usecase.execute('22.00680-0')

    expect(user.props).toEqual({
      ra: '22.00680-0',
      name: 'Rodrigo Diana Siqueira',
      email: '22.00680-0@maua.br',
      role: ROLE.STUDENT,
      password: undefined,
    })
  })
})
