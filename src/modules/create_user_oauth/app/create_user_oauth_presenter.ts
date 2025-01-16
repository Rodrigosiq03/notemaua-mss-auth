/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Environments } from '../../../shared/environments'
import { LambdaHttpRequest, LambdaHttpResponse } from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { TokenAuth } from '../../../shared/helpers/external_interfaces/token_auth'
import { CreateUserOAuthController } from './create_user_oauth_controller'
import { CreateUserOAuthUsecase } from './create_user_oauth_usecase'

const repo = Environments.getUserRepo()
const tokenAuth = new TokenAuth()
const usecase = new CreateUserOAuthUsecase(repo, tokenAuth)
const controller = new CreateUserOAuthController(usecase)

export async function oAuthUserPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event)
  const response = await controller.handle(httpRequest)
  const httpResponse = new LambdaHttpResponse(response?.body, response?.statusCode, response?.headers)

  return httpResponse.toJSON()
}

export async function handler(event: any, context: any) {
  const response = await oAuthUserPresenter(event)
  return response
}