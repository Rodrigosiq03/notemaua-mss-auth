import { User } from '../../../shared/domain/entities/user'
import { ROLE } from '../../../shared/domain/enums/role_enum'
import { STATE } from '../../../shared/domain/enums/state_enum'

export class UserViewmodel {
  private ra: string
  private name: string
  private email: string
  private role: ROLE

  constructor(user: User) {
    this.ra = user.ra
    this.name = user.name
    this.email = user.email
    this.role = user.role as ROLE
  }

  toJSON() {
    return {
      'ra': this.ra,
      'name': this.name,
      'email': this.email,
      'role': this.role,
    }
  }
}

export class GetAllUsersViewmodel {
  private users: UserViewmodel[]

  constructor(users: User[]) {
    this.users = users.map((user) => new UserViewmodel(user))
  }

  toJSON() {
    return {
      'users': this.users.map((user) => user.toJSON()),
      'message': 'All users have been retrieved successfully',
    }
  }
}