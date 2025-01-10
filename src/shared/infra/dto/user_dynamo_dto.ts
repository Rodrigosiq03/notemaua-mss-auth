/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROLE } from '../../../shared/domain/enums/role_enum'
import { User } from '../../domain/entities/user'

type UserDynamoDTOProps = {
  id: string
  ra: string
  name: string | null
  email: string
  role: ROLE
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export class UserDynamoDTO {
  private id: string
  private ra: string
  private name: string | null
  private email: string
  private role: ROLE
  private createdAt: Date
  private updatedAt: Date

  constructor (props: UserDynamoDTOProps) {
    this.id = props.id
    this.ra = props.ra
    this.name = props.name
    this.email = props.email
    this.role = props.role
    this.createdAt = props.createdAt ?? new Date()
    this.updatedAt = props.updatedAt ?? new Date()
  }

  static fromEntity(user: User): UserDynamoDTO {
    return new UserDynamoDTO({
      id: user.id,
      ra: user.ra,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })
  }

  toDynamo() {
    return {
      'entity': 'user',
      'id': this.id,
      'ra': this.ra,
      'name': this.name,
      'email': this.email,
      'role': this.role,
      'createdAt': this.createdAt.toISOString(),
      'updatedAt': this.updatedAt.toISOString(),
    }
  }

  static fromDynamo(userData: any) {
    const id = userData['id'] && userData['id']['S'] ? userData['id']['S'] : undefined
    const ra = userData['ra'] && userData['ra']['S'] ? userData['ra']['S'] : undefined
    const name = userData['name'] && userData['name']['S'] ? userData['name']['S'] : undefined
    const email = userData['email'] && userData['email']['S'] ? userData['email']['S'] : undefined
    const role = userData['role'] && userData['role']['S'] ? userData['role']['S'] : undefined
    const createdAt = userData['createdAt'] && userData['createdAt']['S'] ? new Date(userData['createdAt']['S']) : undefined
    const updatedAt = userData['updatedAt'] && userData['updatedAt']['S'] ? new Date(userData['updatedAt']['S']) : undefined

    return new UserDynamoDTO({
      id,
      ra,
      name,
      email,
      role,
      createdAt,
      updatedAt
    })
  }

  toEntity() {
    return new User({
      id: this.id,
      ra: this.ra,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    })
  }
}