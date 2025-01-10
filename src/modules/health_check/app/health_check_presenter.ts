/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LambdaHttpResponse } from '../../../shared/helpers/external_interfaces/http_lambda_requests'
import { HealthCheckController } from './health_check_controller'

const controller = new HealthCheckController()

export async function healthCheckPresenter(event: Record<string, any>) {
  const response = await controller.handle()
  const httpResponse = new LambdaHttpResponse(response?.body, response?.statusCode, response?.headers)
  return httpResponse.toJSON()
}

export async function handler(event: any, context: any) {
  const response = await healthCheckPresenter(event)
  return response
}