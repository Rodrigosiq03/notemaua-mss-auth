import https from 'https'
import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserNotAuthenticated } from '../errors/controller_errors'
import querystring from 'querystring'
import axios from 'axios'
import { envs } from '../../../..'
import { ROLE } from '../../domain/enums/role_enum'

dotenv.config()

interface AzureProps {
    displayName: string;
    mail: string;
}

export class TokenAuth {
  secret: string
  client_id: string
  client_secret: string

  constructor() {
    this.secret = process.env.SECRET_KEY || ''
    this.client_id = process.env.AZURE_CLIENT_ID || ''
    this.client_secret = process.env.AZURE_CLIENT_SECRET || ''
  }

  async decode_token(token: string): Promise<string> {
    const decode_token = jwt.verify(token, this.secret) as JwtPayload
    if (!decode_token.user_id) {
      throw new UserNotAuthenticated('Invalid or expired token.')
    }
    return decode_token.user_id
  }

  async generate_token(email: string, name: string): Promise<string> {
    // ra schema: 22.00680-0, 22.00680-1, 22.00680-2, 22.00680-3, 00.00000-0
    const regexRa = /^(\d{2}\.\d{5}-\d)$/
    const employeeOrStudent = email.split('@')[0]
    let ra: string | undefined = undefined
    let role: ROLE | undefined = undefined
    if (regexRa.test(employeeOrStudent)) {
      ra = employeeOrStudent
      role = ROLE.STUDENT
    } else {
      role = ROLE.EMPLOYEE
    }

    return jwt.sign({ user: { email, name, role, ra }}, this.secret)
  }

  async get_access_token(code: string, code_verifier: string, redirect_uri: string): Promise<string> {
    const token_endpoint = 'https://login.microsoftonline.com/organizations/oauth2/v2.0/token'

    const body = querystring.stringify({
      client_id: this.client_id,
      scope: 'User.Read openid profile email offline_access',
      code: code,
      redirect_uri,
      grant_type: 'authorization_code',
      client_secret: this.client_secret,
      code_verifier
    })

    try {
      const response = await axios.post(token_endpoint, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body)
        }
      })

      return response.data.access_token
    } catch (err: any) {
      throw new UserNotAuthenticated(err.response.data.error_description)
    }
  }

  async verify_azure_token(token: string): Promise<AzureProps> {
    const options = {
      url: envs.AZURE_URL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await axios.get(envs.AZURE_URL, options)
      console.log(response.data)
      return {
        displayName: response.data.displayName,
        mail: response.data.mail
      }

    } catch (err: any) {
      throw new UserNotAuthenticated(err.response.data.error_description)
    }

    // return await new Promise((resolve, reject) => {
    //   https.get(url, options, (res) => {
    //     let data = ''
    //     res.on('data', (chunk) => data += chunk)
    //     res.on('end', () => {
    //       const response = JSON.parse(data)
    //       if (!response.displayName || !response.mail) {
    //         reject(new UserNotAuthenticated('Invalid or expired token.'))
    //       }
    //       resolve({
    //         displayName: response.displayName,
    //         mail: response.mail
    //       })
    //     })
    //   }).on('error', (err) => reject(err))
    // })
  }
}
