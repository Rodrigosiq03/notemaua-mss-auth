import { it, expect, describe } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { GetUserUsecase } from '../../../../src/modules/get_user/app/get_user_usecase'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert Get User usecase is correct at all', () => {
  it('Should create a get user usecase correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new GetUserUsecase(repo)

    const user = await usecase.execute('22.00000-0')

    expect(user.props).toEqual({
      ra: '22.00000-0',
      name: 'user1',
      email: '22.00000-0@maua.br',
      role: ROLE.STUDENT,
      password: '$2a$06$eZD/Cu7rW77o.FM1EsEne.pHe9IQOeVICkbbtrXZkJjJh8rih1nJ.',
    })
  })
  
})