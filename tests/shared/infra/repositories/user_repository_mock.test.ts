import { describe, it, expect } from 'vitest'
import { User } from '../../../../src/shared/domain/entities/user'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert User Repository Mock is correct at all', () => {
  it('Should create user correctly', async () => {
    const user = new User({
      ra: '22.00680-0',
      name: 'usuario10',
      email: 'usuario10@gmail.com',
      password: 'Teste123$'
    })

    const repo = new UserRepositoryMock()
    const lastLength = repo.getLength()
    await repo.createUser(user)
    const newLength = repo.getLength()

    expect(newLength).toEqual(lastLength + 1)
  })
  it('Should get user correctly', async () => {
    const repo = new UserRepositoryMock()
    const user = await repo.getUser('22.00000-0')
    if (user) {
      expect(user.ra).toEqual('22.00000-0')
      expect(user.name).toEqual('user1')
      expect(user.email).toEqual('22.00000-0@maua.br')
      expect(user.role).toEqual(ROLE.STUDENT)
    }
  })
  it('Should get all users correctly', async () => {
    const repo = new UserRepositoryMock()
    const users = repo.getLength()

    expect(users).toEqual(3)
  })
  it('Should update user correctly', async () => {
    const repo = new UserRepositoryMock()
    
    const userUpdated = await repo.updateUser('22.00000-0', 'Teste123$')

    expect(userUpdated?.ra).toEqual('22.00000-0')
    expect(userUpdated?.password).toEqual('Teste123$')
    expect(userUpdated?.role).toEqual(ROLE.STUDENT)
  })
  it('Should delete user correctly', async () => {
    const repo = new UserRepositoryMock()
    const lastLength = repo.getLength()
    await repo.deleteUser('22.00000-0')
    const newLength = repo.getLength()

    expect(newLength).toEqual(lastLength - 1)
  })
  it('Should login user correctly', async () => {
    const repo = new UserRepositoryMock()
    const user = await repo.login('22.00000-0@maua.br')

    expect(user?.ra).toEqual('22.00000-0')
    expect(user).toBeInstanceOf(User)
  })
})