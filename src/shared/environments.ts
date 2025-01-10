import { STAGE } from './domain/enums/stage_enum'
import { IUserRepository } from './domain/repositories/user_repository_interface'
import { UserRepositoryDynamo } from './infra/repositories/user_repository_dynamo'
import {envs} from '../../index'

export class Environments {
  stage: STAGE = STAGE.TEST
  s3BucketName: string = ''
  region: string = ''
  endpointUrl: string = ''
  dynamoTableName: string = ''
  dynamoPartitionKey: string = ''
  dynamoSortKey: string = ''
  cloudFrontGetUserPresenterDistributionDomain: string = ''
  mssName: string = ''

  configureLocal() {
    console.log('process.envs.STAGE - [envsIRONMENTS - { CONFIGURE LOCAL }] - ', )
    envs.STAGE = envs.STAGE || 'TEST'
  }

  loadenvss() {
    if (!envs.STAGE) {
      this.configureLocal()
    }

    this.stage = envs.STAGE as STAGE

    console.log('process.envs.STAGE - [CHEGOU NO LOAD_envsS] - ', envs.STAGE)
    console.log('process.envs.DYNAMOTABLENAME - [CHEGOU NO LOAD_envsS] - ', envs.DYNAMO_TABLE_NAME)
    console.log('process.envs.ENDPOINT_URL - [CHEGOU NO LOAD_envsS] - ', envs.ENDPOINT_URL)
    console.log('process.envs.REGION - [CHEGOU NO LOAD_envsS] - ', envs.REGION)
    console.log('this.stage - [CHEGOU NO LOAD_envsS] - ', this.stage)
    console.log('this.DYNAMOTABLENAME - [CHEGOU NO LOAD_envsS] - ', this.dynamoTableName)
    this.mssName = envs.MSS_NAME as string

    if (this.stage === STAGE.TEST) {
      this.s3BucketName = 'bucket-test'
      this.region = 'sa-east-1'
      this.endpointUrl = 'http://localhost:8000'
      this.dynamoTableName = 'UserMssTemplateTable'
      this.dynamoPartitionKey = 'PK'
      this.dynamoSortKey = 'SK'
      this.cloudFrontGetUserPresenterDistributionDomain = 'https://d3q9q9q9q9q9q9.cloudfront.net'
    } else {
      this.s3BucketName = envs.S3_BUCKET_NAME as string
      this.region = envs.REGION as string
      this.endpointUrl = envs.ENDPOINT_URL as string
      this.dynamoTableName = envs.DYNAMO_TABLE_NAME as string
      this.dynamoPartitionKey = envs.DYNAMO_PARTITION_KEY as string
      this.dynamoSortKey = envs.DYNAMO_SORT_KEY as string
      this.cloudFrontGetUserPresenterDistributionDomain = envs.CLOUD_FRONT_DISTRIBUTION_DOMAIN as string
    }
  }

  static getUserRepo(): IUserRepository {
    console.log('envsironments.getenvss().stage - [envsIRONMENTS - { GET USER REPO }] - ', Environments.getEnvs().stage)
    return new UserRepositoryDynamo()
  }

  static getEnvs(): Environments {
    const envss = new Environments()
    envss.loadenvss()
    return envss
  }
}
