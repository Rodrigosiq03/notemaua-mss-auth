import { User } from '../entities/user'

export interface IUserRepository {
  getUser(ra: string): Promise<User>
  getAllUsers(): Promise<User[]>
  createUser(user: User): Promise<User>
  updateUser(ra: string, newName?: string, newEmail?: string, newPassword?: string): Promise<User>
  deleteUser(ra: string): Promise<User>
  login(email: string, password: string): Promise<User>
}