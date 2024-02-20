import { describe, it, expect } from 'vitest'
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { UserDynamoDTO } from '../../../../src/shared/infra/dto/user_dynamo_dto'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert User Dynamo DTO is correct at all', () => {
  it('Should get user dto correctly', async () => {
    const repo = new UserRepositoryMock()
    const user = await repo.getUser('22.00000-0')
    const expectedDto = new UserDynamoDTO({
      ra: user?.ra,
      name: user?.name,
      email: user?.email,
      role: user?.role as ROLE,
      password: user?.password
    })

    const fromEntity = UserDynamoDTO.fromEntity(user)

    expect(fromEntity).toEqual(expectedDto)
  })
  it('Should get a to dynamo dto correctly', async () => {
    const repo = new UserRepositoryMock()
    const user = await repo.getUser('22.00000-0')
    const userDto = new UserDynamoDTO({
      ra: user?.ra,
      name: user?.name,
      email: user?.email,
      role: user?.role as ROLE,
      password: user?.password
    })
    const userDynamo = userDto.toDynamo()
    const expectedDynamo = {
      'entity': 'user',
      'ra': user?.ra,
      'name': user?.name,
      'email': user?.email,
      'role': user?.role,
      'password': user?.password,
    }

    expect(userDynamo).toEqual(expectedDynamo)
  })
  it('Should get a correctly user from dynamo dto', async () => {
    const dynamo_dict = {'Item': {'ra': { 'S': '22.00000-0'},
      'name': { 'S': 'user1'},
      'SK': { 'S': '#1'},
      'role': { 'S': 'STUDENT'},
      'PK': { 'S': 'user#1' },
      'entity': { 'S': 'user' },
      'email': { 'S': 'user1@gmail.com'},
      'password': { 'S': 'Teste123$' }},
    'ResponseMetadata': {'RequestId': 'aa6a5e5e-943f-4452-8c1f-4e5441ee6042',
      'HTTPStatusCode': 200,
      'HTTPHeaders': {'date': 'Fri, 16 Dec 2022 15:40:29 GMT',
        'content-type': 'application/x-amz-json-1.0',
        'x-amz-crc32': '3909675734',
        'x-amzn-requestid': 'aa6a5e5e-943f-4452-8c1f-4e5441ee6042',
        'content-length': '174',
        'server': 'Jetty(9.4.48.v20220622)'},
      'RetryAttempts': 0}}
    
    const user = UserDynamoDTO.fromDynamo(dynamo_dict['Item'])
    const expectedUser = new UserDynamoDTO({
      ra: '22.00000-0',
      name: 'user1',
      email: 'user1@gmail.com',
      role: ROLE.STUDENT,
      password: 'Teste123$'
    })

    expect(user).toEqual(expectedUser)
  })
  it('Should get a correctly to entity', async () => {
    const repo = new UserRepositoryMock()
    const userRepo = await repo.getUser('22.00000-0')
    const userDto = new UserDynamoDTO({
      ra: userRepo?.ra,
      name: userRepo?.name,
      email: userRepo?.email,
      role: userRepo?.role as ROLE,
      password: userRepo?.password
    }) 

    const user = userDto.toEntity()

    expect(user).toEqual(userRepo)
  })
  it('Should get a correctly from dynamo to entity', async () => {
    const dynamo_item = {'Item': {'ra': { 'S': '22.00000-0'},
      'name': { 'S': 'user1'},
      'SK': { 'S': '#1'},
      'role': { 'S': 'STUDENT'},
      'PK': { 'S': 'user#1' },
      'entity': { 'S': 'user' },
      'email': { 'S': '22.00000-0@maua.br'},
      'password': { 'S': '$2a$06$eZD/Cu7rW77o.FM1EsEne.pHe9IQOeVICkbbtrXZkJjJh8rih1nJ.' }}
    }

    const userDto = UserDynamoDTO.fromDynamo(dynamo_item['Item'])
    const user = userDto.toEntity()

    const repo = new UserRepositoryMock()
    const userRepo = await repo.getUser('22.00000-0')

    expect(user).toEqual(userRepo)
  })
  it('Should get a correctly from entity to dynamo', async () => {
    const repo = new UserRepositoryMock()
    const userRepo = await repo.getUser('22.00000-0')
    const userDto = UserDynamoDTO.fromEntity(userRepo)
    const userDynamo = userDto.toDynamo()
    const expectedDynamo = {
      'entity': 'user',
      'ra': userRepo?.ra,
      'name': userRepo?.name,
      'email': userRepo?.email,
      'role': userRepo?.role,
      'password': userRepo?.password,
    }

    expect(userDynamo).toEqual(expectedDynamo)
  })
  it('Should get user with no password dto correctly', async () => {
    const repo = new UserRepositoryMock()
    const user = await repo.getUser('22.22222-2')
    const expectedDto = new UserDynamoDTO({
      ra: user?.ra,
      name: user?.name,
      email: user?.email,
      role: user?.role as ROLE,
      password: user?.password
    })

    const fromEntity = UserDynamoDTO.fromEntity(user)

    expect(fromEntity).toEqual(expectedDto)
  })
  it('Should get a to dynamo dto with no password correctly', async () => {
    const repo = new UserRepositoryMock()
    const user = await repo.getUser('22.22222-2')
    const userDto = new UserDynamoDTO({
      ra: user?.ra,
      name: user?.name,
      email: user?.email,
      role: user?.role as ROLE,
      password: user?.password
    })
    const userDynamo = userDto.toDynamo()
    const expectedDynamo = {
      'entity': 'user',
      'ra': user?.ra,
      'name': user?.name,
      'email': user?.email,
      'role': user?.role,
      'password': user?.password,
    }

    expect(userDynamo).toEqual(expectedDynamo)
  })
  it('Should get a correctly user from dynamo dto with no password', async () => {
    const dynamo_dict = {'Item': {'ra': { 'S': '22.22222-2'},
      'name': { 'S': 'user1'},
      'SK': { 'S': '#1'},
      'role': { 'S': 'STUDENT'},
      'PK': { 'S': 'user#1' },
      'entity': { 'S': 'user' },
      'email': { 'S': '22.22222-2@maua.br'},
    }
    }

    const user = UserDynamoDTO.fromDynamo(dynamo_dict['Item'])
    const expectedUser = new UserDynamoDTO({
      ra: '22.22222-2',
      name: 'user1',
      email: '22.22222-2@maua.br',
      role: ROLE.STUDENT,
      password: undefined
    })

    expect(user).toEqual(expectedUser)
  })
  it('Should get a correctly to entity with no password', async () => {
    const repo = new UserRepositoryMock()
    const userRepo = await repo.getUser('22.22222-2')
    const userDto = new UserDynamoDTO({
      ra: userRepo?.ra,
      name: userRepo?.name,
      email: userRepo?.email,
      role: userRepo?.role as ROLE,
      password: userRepo?.password
    }) 

    const user = userDto.toEntity()

    expect(user).toEqual(userRepo)
  })
})
