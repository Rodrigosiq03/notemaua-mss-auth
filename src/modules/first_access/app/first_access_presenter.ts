/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Environments } from '../../../shared/environments'
import { LambdaHttpRequest, LambdaHttpResponse } from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { FirstAccessController } from './first_access_controller'
import { FirstAccessUsecase } from './first_access_usecase'

const repo = Environments.getUserRepo()
const usecase = new FirstAccessUsecase(repo)
const controller = new FirstAccessController(usecase)

export async function firstAccessPresenter(event: Record<string, any>) {
  const httpRequest = new LambdaHttpRequest(event)
  const response = await controller.handle(httpRequest)
  const httpResponse = new LambdaHttpResponse(response?.body, response?.statusCode, response?.headers)

  return httpResponse.toJSON()
}

export async function handler(event: any, context: any) {
  const response = await firstAccessPresenter(event)
  return response
}