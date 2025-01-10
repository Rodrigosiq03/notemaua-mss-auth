import { EntityError } from '../../helpers/errors/domain_errors'
import { ROLE } from '../enums/role_enum'

class UserProps {
  id!: string;
  ra!: string;
  name!: string | null;
  email!: string;
  role!: ROLE;
  createdAt!: Date;
  updatedAt!: Date;
}

export class User {
  id: string;
  ra: string;
  name: string | null;
  email: string;
  role: ROLE;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: UserProps) {
    this.id = this.validate_set_id(props.id);
    this.ra = props.ra;
    this.name = props.name;
    this.email = this.validate_set_email(props.email);
    this.role = this.validate_set_role(props.role);
    this.createdAt = this.validate_set_createdAt(props.createdAt);
    this.updatedAt = this.validate_set_updatedAt(props.updatedAt);
  }

  public to_json() {
    return {
      id: this.id,
      ra: this.ra,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private validate_set_id(id: string) {
    if (id == null || id == "") {
      throw new EntityError("Parameter id is required");
    }
    if (typeof id !== "string") {
      throw new EntityError("Parameter id is not a string");
    }
    if (id.length != 36) {
      throw new EntityError("Parameter id is not a valid UUID");
    }
    return id;
  }

  private validate_set_email(email: string) {
    if (email == null || email == "") {
      throw new EntityError("Parameter email is required");
    }
    if (typeof email !== "string") {
      throw new EntityError("Parameter email is not a string");
    }
    let padrao: RegExp = /^[a-zA-Z0-9._%+-]+@maua\.br$/;
    if (!padrao.test(email)) {
      throw new EntityError("Invalid Email, must be a maua.br domain");
    }
    return email;
  }

  private validate_set_role(role: ROLE) {
    if (role == null) {
      throw new EntityError("Parameter role is required");
    }
    if (!(role in ROLE)) {
      throw new EntityError("Parameter role is not a UserTypeEnum");
    }
    return role;
  }

  private validate_set_createdAt(createdAt: Date) {
    if (createdAt == null) {
      throw new EntityError("Parameter createdAt is required");
    }
    if (typeof createdAt !== "object") {
      throw new EntityError("Parameter createdAt is not a Date");
    }
    return createdAt;
  }

  private validate_set_updatedAt(updatedAt: Date) {
    if (updatedAt == null) {
      throw new EntityError("Parameter updatedAt is required");
    }
    if (typeof updatedAt !== "object") {
      throw new EntityError("Parameter updatedAt is not a Date");
    }
    return updatedAt;
  }
}