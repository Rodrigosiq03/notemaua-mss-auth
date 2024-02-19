/* eslint-disable @typescript-eslint/no-explicit-any */
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Resource, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'
import { Duration } from 'aws-cdk-lib'
import * as path from 'path'

export class LambdaStack extends Construct {
  functionsThatNeedDynamoPermissions: lambda.Function[] = []
  lambdaLayer: lambda.LayerVersion

  getUserFunction: lambda.Function
  getAllUsersFunction: lambda.Function
  createUserFunction: lambda.Function
  deleteUserFunction: lambda.Function
  updateUserFunction: lambda.Function
  loginFunction: lambda.Function
  forgotPasswordFunction: lambda.Function
  confirmForgotPasswordFunction: lambda.Function
  firstAccessFunction: lambda.Function


  createLambdaApiGatewayIntegration(moduleName: string, method: string, mssStudentApiResource: Resource, environmentVariables: Record<string, any>) {
    const modifiedModuleName = moduleName.toLowerCase().split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    
    // create_user -> Create_user

    const lambdaFunction = new NodejsFunction(this, modifiedModuleName, {
      functionName: `${modifiedModuleName}`,
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
    super(scope, 'NotemauaMssAuthLambdaStack')

    this.lambdaLayer = new lambda.LayerVersion(this, 'NotemauaAuthLayer', {
      code: lambda.Code.fromAsset('./shared'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_18_X],
    })

    this.getUserFunction = this.createLambdaApiGatewayIntegration('get_user', 'GET', apiGatewayResource, environmentVariables)
    this.getAllUsersFunction = this.createLambdaApiGatewayIntegration('get_all_users', 'GET', apiGatewayResource, environmentVariables)
    this.createUserFunction = this.createLambdaApiGatewayIntegration('create_user', 'POST', apiGatewayResource, environmentVariables)
    this.deleteUserFunction = this.createLambdaApiGatewayIntegration('delete_user', 'DELETE', apiGatewayResource, environmentVariables)
    this.updateUserFunction = this.createLambdaApiGatewayIntegration('update_user', 'PUT', apiGatewayResource, environmentVariables)
    this.loginFunction = this.createLambdaApiGatewayIntegration('login', 'POST', apiGatewayResource, environmentVariables)
    this.forgotPasswordFunction = this.createLambdaApiGatewayIntegration('forgot_password', 'POST', apiGatewayResource, environmentVariables)
    this.confirmForgotPasswordFunction = this.createLambdaApiGatewayIntegration('confirm_forgot_password', 'POST', apiGatewayResource, environmentVariables)
    this.firstAccessFunction = this.createLambdaApiGatewayIntegration('first_access', 'POST', apiGatewayResource, environmentVariables)

    this.functionsThatNeedDynamoPermissions = [
      this.getUserFunction, 
      this.createUserFunction, 
      this.deleteUserFunction, 
      this.updateUserFunction, 
      this.getAllUsersFunction,
      this.loginFunction,
      this.forgotPasswordFunction,
      this.confirmForgotPasswordFunction,
      this.firstAccessFunction
    ]
  }
}