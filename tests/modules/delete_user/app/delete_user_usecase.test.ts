import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { DeleteUserUsecase } from '../../../../src/modules/delete_user/app/delete_user_usecase'
import { EntityError } from '../../../../src/shared/helpers/errors/domain_errors'

describe('Assert Delete User usecase is correct at all', () => {
  const repo = new UserRepositoryMock()
  const usecase = new DeleteUserUsecase(repo)

  it('Should activate usecase correctly', async () => {
    const user = await usecase.execute('22.00000-0')
    expect(user).toBeDefined()
  })
})