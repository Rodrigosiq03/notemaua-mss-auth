import { EntityError } from '../../helpers/errors/domain_errors'
import { ROLE, toEnum } from '../enums/role_enum'

export type UserProps = {
  ra: string;
  name: string;
  email: string;
  role: ROLE
}

export type JsonProps = {
  ra: string;
  name: string;
  email: string;
  role: string;
}

export class User {
  constructor (public props: UserProps) {
    if (!User.validateRa(props.ra as string)) {
      throw new EntityError('props.ra')
    }
    this.props.ra = props.ra

    if (!User.validateName(props.name)) {
      throw new EntityError('props.name')
    }
    this.props.name = props.name

    if (!User.validateEmail(props.email)) {
      throw new EntityError('props.email')
    }
    this.props.email = props.email

    if (!User.validateRole(props.role as ROLE)) {
      throw new EntityError('props.role')
    }
    this.props.role = props.role

  }

  get ra() {
    return this.props.ra
  }

  set setRa(ra: string) {
    if (!User.validateRa(ra)) {
      throw new EntityError('props.ra')
    }
    this.props.ra = ra
  }

  get name() {
    return this.props.name
  }

  set setName(name: string) {
    if (!User.validateName(name)) {
      throw new EntityError('props.name')
    }
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set setEmail(email: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError('props.email')
    }
    this.props.email = email
  }

  get role() {
    return this.props.role
  }

  set setRole(role: ROLE) {
    if (!User.validateRole(role)) {
      throw new EntityError('props.role')
    }
    this.props.role = role
  }
    
  static fromJSON(json: JsonProps) {
    return new User({
      ra: json.ra,
      name: json.name,
      email: json.email,
      role: toEnum(json.role as string)
    })
  }

  toJSON() {
    return {
      ra: this.ra,
      name: this.name,
      email: this.email,
      role: this.role
    }
  }

  static validateRa(ra: string): boolean {
    if (ra == null) {
      return false
    } else if (typeof(ra) != 'string') {
      return false
    }
    return true
  }

  static validateName(name: string): boolean {
    if (name == null) {
      return false
    } else if (typeof(name) != 'string') {
      return false
    } else if (name.length < 3) {
      return false
    }
    return true
  }

  static validateEmail(email: string): boolean {
    const regexp = '(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$)'

    if (email == null) {
      return false
    }
    if (typeof(email) != 'string') {
      return false
    }
    if (!email.match(regexp)) {
      return false
    }
    return true
  }

  static validateRole(role: ROLE): boolean {
    if (role == null) {
      return false
    } 
    if (Object.values(ROLE).includes(role) == false) {
      return false
    }
    return true
  }

}