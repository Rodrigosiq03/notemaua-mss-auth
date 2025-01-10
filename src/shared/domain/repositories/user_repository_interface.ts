import { User } from '../entities/user'

export interface IUserRepository {
  getUser(ra: string): Promise<User>
  getUserByEmail(email: string): Promise<User>
  getAllUsers(): Promise<User[]>
  createUser(user: User): Promise<User>
  updateUser(user: User): Promise<User>
  deleteUser(ra: string): Promise<User>
  login(email: string): Promise<User>
}