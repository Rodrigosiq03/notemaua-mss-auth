/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROLE } from '../../../shared/domain/enums/role_enum'
import { User } from '../../domain/entities/user'

type UserDynamoDTOProps = {
  ra: string
  name: string
  email: string
  role: ROLE
  password?: string
}

export class UserDynamoDTO {
  private ra: string
  private name: string
  private email: string
  private role: ROLE
  private password?: string

  constructor (props: UserDynamoDTOProps) {
    this.ra = props.ra
    this.name = props.name
    this.email = props.email
    this.role = props.role
    this.password = props.password
  }

  static fromEntity(user: User): UserDynamoDTO {
    return new UserDynamoDTO({
      ra: user.ra,
      name: user.name,
      email: user.email,
      role: user.role as ROLE,
      password: user.password
    })
  }

  toDynamo() {
    return {
      'entity': 'user',
      'ra': this.ra,
      'name': this.name,
      'email': this.email,
      'role': this.role,
      'password': this.password,
    }
  }

  static fromDynamo(userData: any) {
    const ra = userData['ra'] && userData['ra']['S'] ? userData['ra']['S'] : null
    const name = userData['name'] && userData['name']['S'] ? userData['name']['S'] : null
    const email = userData['email'] && userData['email']['S'] ? userData['email']['S'] : null
    const role = userData['role'] && userData['role']['S'] ? userData['role']['S'] : null
    const password = userData['password'] && userData['password']['S'] ? userData['password']['S'] : null

    return new UserDynamoDTO({
      ra,
      name,
      email,
      role,
      password
    })
  }

  toEntity() {
    return new User({
      ra: this.ra,
      name: this.name,
      email: this.email,
      role: this.role,
      password: this.password
    })
  }
}