import { User } from '../../../shared/domain/entities/user'
import { IUserRepository } from '../../../shared/domain/repositories/user_repository_interface'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { ForbiddenAction } from '../../../shared/helpers/errors/usecase_errors'
import { getUserName, validateStudent } from '../../../shared/services/validate_student'

export class CreateUserUsecase {
  constructor(private repo: IUserRepository) {}

  async execute(ra: string) {
    const name = getUserName(ra)
    const email = `${ra}@maua.br`
    if (name && !User.validateName(name)) {
      throw new EntityError('name')
    }
    if (!User.validateEmail(email)) {
      throw new EntityError('email')
    }
    if (!User.validateRa(ra)) {
      throw new EntityError('ra')
    }
    if (!validateStudent(ra)) {
      throw new ForbiddenAction('ra')
    }
    if (name === null) {
      throw new ForbiddenAction('name')
    }

    
    const user = new User({ra, name, email})
    return this.repo.createUser(user)

  }
}