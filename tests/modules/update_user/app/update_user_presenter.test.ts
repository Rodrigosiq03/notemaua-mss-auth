import { describe, it, expect } from 'vitest'
import { handler } from '../../../../src/modules/update_user/app/update_user_presenter'
import envs from '../../../..'
import jwt from 'jsonwebtoken'

describe('Assert Update User presenter is correct at all', () => {
  const user = {
    role: 'STUDENT',
    name: 'Luca Pinheiro Gomes',
    ra: '23.00555-7',
  }
  const secret = envs.JWT_SECRET

  if (secret === undefined) throw Error('JWT_SECRET is not defined')

  const token = jwt.sign({ user: JSON.stringify(user)}, secret)

  it('Should activate presenter correctly', async () => {
    const event = {
      'version': '2.0',
      'routeKey': '$default',
      'rawPath': '/my/path',
      'rawQueryString': 'parameter1=value1&parameter1=value2&parameter2=value',
      'cookies': [
        'cookie1',
        'cookie2'
      ],
      'headers': {
        'header1': 'value1',
        'header2': 'value1,value2',
        'Authorization': `Bearer ${token}`,
      },
      'queryStringParameters': {
        'parameter1': 'value1',
      },
      'requestContext': {
        'accountId': '123456789012',
        'apiId': '<urlid>',
        'authentication': null,
        'authorizer': {
          'iam': {
            'accessKey': 'AKIA...',
            'accountId': '111122223333',
            'callerId': 'AIDA...',
            'cognitoIdentity': null,
            'principalOrgId': null,
            'userArn': 'arn:aws:iam::111122223333:user/example-user',
            'userId': 'AIDA...'
          }
        },
        'domainName': '<url-id>.lambda-url.us-west-2.on.aws',
        'domainPrefix': '<url-id>',
        'external_interfaces': {
          'method': 'POST',
          'path': '/my/path',
          'protocol': 'HTTP/1.1',
          'sourceIp': '123.123.123.123',
          'userAgent': 'agent'
        },
        'requestId': 'id',
        'routeKey': '$default',
        'stage': '$default',
        'time': '12/Mar/2020:19:03:58 +0000',
        'timeEpoch': 1583348638390
      },
      'body': {'ra': '22.00000-0', 'password': 'Teste123$'},
      'pathParameters': null,
      'isBase64Encoded': null,
      'stageVariables': null
    }

    const response = await handler(event, null)

    expect(response?.statusCode).toEqual(200)
    expect(JSON.parse(response?.body)['ra']).toEqual('22.00000-0')
    expect(JSON.parse(response?.body)['name']).toEqual('user1')
    expect(JSON.parse(response?.body)['email']).toEqual('22.00000-0@maua.br')
    expect(JSON.parse(response?.body)['role']).toEqual('STUDENT')
    expect(JSON.parse(response?.body)['message']).toEqual('Your password was updated successfully')

  })
})
