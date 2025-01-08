/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../domain/repositories/user_repository_interface'
import { NoItemsFound } from '../../helpers/errors/usecase_errors'
import { UserDynamoDTO } from '../dto/user_dynamo_dto'
import { DynamoDatasource } from '../external/dynamo/datasources/dynamo_datasource'
import { Environments } from '../../../shared/environments'
import { hash } from 'bcryptjs'

export class UserRepositoryDynamo implements IUserRepository {

  static partitionKeyFormat(email: string): string {
    return `user#${email}`
  }

  static sortKeyFormat(email: string): string {
    return `#${email}`
  }

  constructor(private dynamo: DynamoDatasource = new DynamoDatasource(
    Environments.getEnvs().dynamoTableName, 
    Environments.getEnvs().dynamoPartitionKey, 
    Environments.getEnvs().region, undefined, undefined, Environments.getEnvs().endpointUrl, Environments.getEnvs().dynamoSortKey
  )) {}

  async updateUser(user: User): Promise<User> {
    const userExists = await this.getUser(user.email)

    if (!userExists) {
      throw new NoItemsFound('email')
    }

    const updatePaemailms: {
      UpdateExpression: string,
      ExpressionAttributeNames: { '#name': string, '#role': string, '#updatedAt': string, '#password'?: string },
      ExpressionAttributeValues: { ':name': string, ':role': string, ':updatedAt': string, ':password'?: string }
    } = {
      UpdateExpression: 'set #name = :name, #role = :role, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#role': 'role',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':name': user.name || '',
        ':role': user.role,
        ':updatedAt': new Date().toISOString()
      }
    }

    const resp = await this.dynamo.updateItem(
      UserRepositoryDynamo.partitionKeyFormat(user.email),
      UserRepositoryDynamo.sortKeyFormat(user.email),
      updatePaemailms
    )

    const updatedUserDto = UserDynamoDTO.fromDynamo(resp['Attributes'])
    return Promise.resolve(updatedUserDto.toEntity())
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.getUser(email)

    if (!user) throw new NoItemsFound('email')

    return Promise.resolve(user)
  }

  async getUser(email: string): Promise<User> {
    console.log('Environments.getEnvs().dynamoTableName - [GET_USER_REPO_DYNAMO] - ', Environments.getEnvs().dynamoTableName)
    const resp = await this.dynamo.getItem(UserRepositoryDynamo.partitionKeyFormat(email), UserRepositoryDynamo.sortKeyFormat(email))
    
    console.log('resp - [GET_USER_REPO_DYNAMO] - ', resp)

    if (!resp['Item']) {
      throw new NoItemsFound('email')
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
    const userDto = UserDynamoDTO.fromEntity(user)
    await this.dynamo.putItem(
      userDto.toDynamo(),
      UserRepositoryDynamo.partitionKeyFormat(user.email),
      UserRepositoryDynamo.sortKeyFormat(user.email)
    )

    return Promise.resolve(user)
  }

  async deleteUser(email: string): Promise<User> {
    const user = await this.getUser(email)

    if (!user) throw new NoItemsFound('email')

    await this.dynamo.deleteItem(UserRepositoryDynamo.partitionKeyFormat(email), UserRepositoryDynamo.sortKeyFormat(email))

    return Promise.resolve(user)
  }
  async login(email: string): Promise<User> {
    const user = await this.getUser(email)

    if (!user) throw new NoItemsFound('email')

    return Promise.resolve(user)
  }
}