import { describe, expect, it } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { LoginUsecase } from '../../../../src/modules/login/app/login_usecase' 
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'
import { EntityError } from '../../../../src/shared/helpers/errors/domain_errors'

describe('Assert Login usecase is correct at all', () => {
  it('Should login a user correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)

    const user = await usecase.execute('22.00000-0@maua.br', 'Teste123$')

    expect(user.props).toEqual({
      ra: '22.00000-0',
      name: 'user1',
      email: '22.00000-0@maua.br',
      role: ROLE.STUDENT,
      password: '$2a$06$eZD/Cu7rW77o.FM1EsEne.pHe9IQOeVICkbbtrXZkJjJh8rih1nJ.'
    })
  })
  it('Should not login a user with wrong password', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new LoginUsecase(repo)

    try {
      await usecase.execute('22.00000-0@maua.br', 'senhaerradaaqui')
    } catch (error) {
      expect(error).toEqual(new EntityError('password'))
      expect(error.message).toEqual('Field password is not valid')
    }
  })
    
})