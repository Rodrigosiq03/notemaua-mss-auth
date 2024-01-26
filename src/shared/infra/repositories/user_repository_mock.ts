import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../domain/repositories/user_repository_interface'
import { NoItemsFound } from '../../helpers/errors/usecase_errors'

export class UserRepositoryMock implements IUserRepository {
  private users: User[] = [
    new User({
      ra: '22.00000-0',
      name: 'user1',
      email: 'user1@gmail.com',
      password: 'Teste123$'
    }),
    new User({
      ra: '22.11111-1',
      name: 'user2',
      email: 'user2@gmail.com',
      password: 'Teste123$'
    }),
  ]

  getLength(): number {
    return this.users.length
  }

  async getUser(ra: string): Promise<User> {
    const user = this.users.find(user => user.ra === ra)
    if (!user) {
      throw new NoItemsFound('ra')
    }
    return user
  }

  async getAllUsers(): Promise<User[]> {
    return this.users
  }

  async createUser(user: User): Promise<User> {
    const { ra } = user.props
    const userExists = this.users.find(user => user.ra === ra)
    if (userExists) {
      throw new Error('User already exists')
    }
    this.users.push(user)
    return user
  }

  async updateUser(ra: string, newName?: string, newEmail?: string, newPassword?: string): Promise<User> {
    const user = this.users.find(user => user.ra === ra)
    if (!user) {
      throw new NoItemsFound('ra')
    }
    if (newName) {
      user.props.name = newName
    }
    if (newEmail) {
      user.props.email = newEmail
    }
    if (newPassword) {
      user.props.password = newPassword
    }
    return user
  }

  async deleteUser(ra: string): Promise<User> {
    const user = this.users.find(user => user.ra === ra)
    if (!user) {
      throw new NoItemsFound('ra')
    }
    this.users = this.users.filter(user => user.ra !== ra)
    return user
  }

  async login(email: string): Promise<User> {
    const ra = email.split('@')[0]
    const user = this.users.find(user => user.ra === ra)
    if (!user) {
      throw new NoItemsFound('ra')
    }
    return user
  }
}