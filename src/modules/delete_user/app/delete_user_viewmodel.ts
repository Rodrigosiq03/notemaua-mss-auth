import { UserProps } from '../../../shared/domain/entities/user'
import { STATE } from '../../../shared/domain/enums/state_enum'

export class DeleteUserViewmodel {
  private ra: string

  constructor(props: UserProps) {
    this.ra = props.ra
  }

  toJSON() {
    return {
      'ra': this.ra,
      'message': 'The user was deleted successfully'
    }
  }
}