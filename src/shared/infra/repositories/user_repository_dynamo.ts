/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../domain/repositories/user_repository_interface'
import { DuplicatedItem, NoItemsFound } from '../../helpers/errors/usecase_errors'
import { UserDynamoDTO } from '../dto/user_dynamo_dto'
import { DynamoDatasource } from '../external/dynamo/datasources/dynamo_datasource'
import { EntityError } from '../../helpers/errors/domain_errors'
import { Environments } from '../../../shared/environments'
import { hash } from 'bcryptjs'
import { generateRandomPassword } from '../../services/generate_random_password'

export class UserRepositoryDynamo implements IUserRepository {

  static partitionKeyFormat(ra: string): string {
    return `user#${ra}`
  }

  static sortKeyFormat(ra: string): string {
    return `#${ra}`
  }

  constructor(private dynamo: DynamoDatasource = new DynamoDatasource(
    Environments.getEnvs().dynamoTableName, 
    Environments.getEnvs().dynamoPartitionKey, 
    Environments.getEnvs().region, undefined, undefined, Environments.getEnvs().endpointUrl, Environments.getEnvs().dynamoSortKey
  )) {}

  async getUser(ra: string): Promise<User> {
    console.log('Environments.getEnvs().dynamoTableName - [GET_USER_REPO_DYNAMO] - ', Environments.getEnvs().dynamoTableName)
    const resp = await this.dynamo.getItem(UserRepositoryDynamo.partitionKeyFormat(ra), UserRepositoryDynamo.sortKeyFormat(ra))
    
    console.log('resp - [GET_USER_REPO_DYNAMO] - ', resp)

    if (!resp['Item']) {
      throw new NoItemsFound('ra')
    }

    const userDto = UserDynamoDTO.fromDynamo(resp['Item'])

    return Promise.resolve(userDto.toEntity())
  }
  async getAllUsers(): Promise<User[]> {
    const resp = await this.dynamo.getAllItems()
    const users: User[] = []

    for (const item of resp['Items']) {
      const userDto = UserDynamoDTO.fromDynamo(item)
      const user = userDto.toEntity()
      users.push(user)
    }

    return Promise.resolve(users)
  }
  async createUser(user: User): Promise<User> {
    const { password } = user.props
    
    if (password) user.setPassword = await hash(password, 6)

    const userDto = UserDynamoDTO.fromEntity(user)
    await this.dynamo.putItem(userDto.toDynamo(), UserRepositoryDynamo.partitionKeyFormat(user.ra), UserRepositoryDynamo.sortKeyFormat(user.ra))

    return Promise.resolve(userDto.toEntity())
  }
  async updateUser(ra: string, newName?: string, newEmail?: string, newPassword?: string): Promise<User> {
    const itemsToUpdate: Record<string, any> = {}
    let hashedPassword: string = ''
    if (newPassword) {
      hashedPassword = await hash(newPassword, 6)
    }

    switch (true) {
      case !!newName:
        itemsToUpdate['name'] = newName
        break
      case !!newEmail:
        itemsToUpdate['email'] = newEmail
        break
      case !!newPassword:
        itemsToUpdate['password'] = hashedPassword
        break
      default:
        throw new EntityError('Nothing to update')
    }

    const resp = await this.dynamo.updateItem(UserRepositoryDynamo.partitionKeyFormat(ra), UserRepositoryDynamo.sortKeyFormat(ra), itemsToUpdate)

    const userDto = UserDynamoDTO.fromDynamo(resp['Attributes']).toEntity()

    return Promise.resolve(userDto)
  }
  async deleteUser(ra: string): Promise<User> {
    const user = await this.getUser(ra)

    if (!user) throw new NoItemsFound('ra')

    await this.dynamo.deleteItem(UserRepositoryDynamo.partitionKeyFormat(ra), UserRepositoryDynamo.sortKeyFormat(ra))

    return Promise.resolve(user)
  }
  async login(email: string): Promise<User> {
    const ra = email.split('@')[0]
    const user = await this.getUser(ra)

    if (!user) throw new NoItemsFound('email')

    return Promise.resolve(user)
  }

  async firstAccess(ra: string): Promise<User> {
    console.log('ra - [FIRST_ACCESS_REPO_DYNAMO] - ', ra)
    const user = await this.getUser(ra)
    console.log('user - [FIRST_ACCESS_REPO_DYNAMO] - ', user)
    
    if (!user) throw new NoItemsFound('ra')

    if (user.password === undefined || user.password === '' || user.password === null) {
      const newPassword = generateRandomPassword()
      console.log('newPassword - [FIRST_ACCESS_REPO_DYNAMO] - ', newPassword)
      user.setPassword = newPassword

      console.log('newUser - [FIRST_ACCESS_REPO_DYNAMO] - ', user)

      await this.updateUser(ra, undefined, undefined, newPassword)
    }

    console.log('PASSOU DO UPDATE - [FIRST_ACCESS_REPO_DYNAMO] - ', user)

    return Promise.resolve(user)
  }

  async forgotPassword(email: string): Promise<User> {
    const ra = email.split('@')[0]
    const user = await this.getUser(ra)

    if (!user) throw new NoItemsFound('ra')

    return Promise.resolve(user)
  }

  async confirmForgotPassword(email: string, newPassword: string): Promise<User> {
    const ra = email.split('@')[0]
    const user = await this.getUser(ra)

    if (!user) throw new NoItemsFound('ra')

    user.setPassword = await hash(newPassword, 6)

    await this.updateUser(ra, undefined, undefined, newPassword)

    return Promise.resolve(user)
  }

}