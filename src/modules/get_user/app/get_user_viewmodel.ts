import { ROLE } from '../../../shared/domain/enums/role_enum'
import { UserProps } from '../../../shared/domain/entities/user'
import { STATE } from '../../../shared/domain/enums/state_enum'

export class GetUserViewmodel {
  private ra: string
  private name: string
  private email: string
  private role: ROLE

  constructor(props: UserProps) {
    this.ra = props.ra
    this.name = props.name
    this.email = props.email
    this.role = props.role as ROLE
  }

  toJSON() {
    return {
      'ra': this.ra,
      'name': this.name,
      'email': this.email,
      'role': this.role,
      'message': 'The user was retrieved successfully'
    }
  }
}