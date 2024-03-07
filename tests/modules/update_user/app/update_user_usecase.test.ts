import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { UpdateUserUsecase } from '../../../../src/modules/update_user/app/update_user_usecase'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert Update User usecase is correct at all', () => {
  it('Should activate usecase correctly with all parameters', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new UpdateUserUsecase(repo)

    const user = await usecase.execute('22.00000-0', 'Teste123$')

    expect(user.props).toEqual({
      ra: '22.00000-0',
      name: 'user1',
      email: '22.00000-0@maua.br',
      role: ROLE.STUDENT,
      password: 'Teste123$'
    })
  })
})