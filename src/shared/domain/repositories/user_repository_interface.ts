import { User } from '../entities/user'

export interface IUserRepository {
  getUser(ra: string): Promise<User | undefined>
  getUserByEmail(email: string): Promise<User | undefined>
  getAllUsers(): Promise<User[]>
  createUser(user: User): Promise<User>
  deleteUser(email: string): Promise<User | undefined>
}