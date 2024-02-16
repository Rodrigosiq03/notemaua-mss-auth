import { it, expect, describe } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { FirstAccessUsecase } from '../../../../src/modules/first_access/app/first_access_usecase'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert First access usecase is correct at all', () => {
  it('Should First access usecase correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new FirstAccessUsecase(repo)

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