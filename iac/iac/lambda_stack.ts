/* eslint-disable @typescript-eslint/no-explicit-any */
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Resource, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { Duration } from 'aws-cdk-lib'
import * as path from 'path'
import { envs } from '../..'
import { stage } from 'get_stage_env'

export class LambdaStack extends Construct {
  functionsThatNeedDynamoPermissions: lambda.Function[] = []
  lambdaLayer: lambda.LayerVersion

  getUserFunction: lambda.Function
  getAllUsersFunction: lambda.Function
  oAuthUserFunction: lambda.Function
  healthCheckFunction: lambda.Function


  createLambdaApiGatewayIntegration(moduleName: string, method: string, mssStudentApiResource: Resource, environmentVariables: Record<string, any>) {
    const modifiedModuleName = moduleName.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    
    // create_user -> Create_user

    const lambdaFunction = new NodejsFunction(this, `${envs.STACK_NAME}-${modifiedModuleName}`, {
      functionName: `${envs.STACK_NAME}-${modifiedModuleName}`,
      entry: path.join(__dirname, `../../src/modules/${moduleName}/app/${moduleName}_presenter.ts`),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
      layers: [this.lambdaLayer],
      environment: environmentVariables,
      timeout: Duration.seconds(15),
      memorySize: 512
    })

    mssStudentApiResource.addResource(moduleName.toLowerCase().replace(/_/g, '-')).addMethod(method, new LambdaIntegration(lambdaFunction))
    
    return lambdaFunction
  }

  constructor(scope: Construct, apiGatewayResource: Resource, environmentVariables: Record<string, any>) {
    super(scope, `${envs.STACK_NAME}-LambdaStack`)

    this.lambdaLayer = new lambda.LayerVersion(this, `${envs.STACK_NAME}-Layer`, {
      code: lambda.Code.fromAsset('./shared'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    })

    this.getUserFunction = this.createLambdaApiGatewayIntegration('get_user', 'GET', apiGatewayResource, environmentVariables)
    this.getAllUsersFunction = this.createLambdaApiGatewayIntegration('get_all_users', 'GET', apiGatewayResource, environmentVariables)
    this.oAuthUserFunction = this.createLambdaApiGatewayIntegration('oauth_user', 'POST', apiGatewayResource, environmentVariables)
    this.healthCheckFunction = this.createLambdaApiGatewayIntegration('health_check', 'GET', apiGatewayResource, environmentVariables)

    this.functionsThatNeedDynamoPermissions = [
      this.getUserFunction, 
      this.getAllUsersFunction,
      this.oAuthUserFunction
    ]
  }
}