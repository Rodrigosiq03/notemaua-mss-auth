import { User } from '../../../../src/shared/domain/entities/user'
import { EntityError } from '../../../../src/shared/helpers/errors/domain_errors'
import { describe, it, expect } from 'vitest'

describe('[User Entity Tests]', () => {
  it('Assert User Entity is correct at all', () => {
    const user = new User({
      ra: '22.00680-0',
      name: 'Rodrigo Siqueira',
      email: 'rodrigo.dsiqueira1@gmail.com',
    })

    expect(user).toBeInstanceOf(User)
  })

  it('Assert User Entity has an error when name is invalid', () => {
    expect(() => {
      new User({
        ra: '22.00680-0',
        name: '',
        email: 'rodrigo.dsiqueira1@gmail.com',
      })
    }).toThrowError(EntityError)
    expect(() => {
      new User({
        ra: '22.00680-0',
        name: '',
        email: 'rodrigo.dsiqueira1@gmail.com',
      })
    }).toThrowError('Field props.name is not valid')
  })
  it('Assert User Entity has an error when email is invalid', () => {
    expect(() => {
      new User({
        ra: '22.00680-0',
        name: 'Rodrigo Diana Siqueira',
        email: 'rodrigo.dsiqueira1',
      })
    }).toThrowError(EntityError)
    expect(() => {
      new User({
        ra: '22.00680-0',
        name: 'Rodrigo Diana Siqueira',
        email: 'rodrigo.dsiqueira1',
      })
    }).toThrowError('Field props.email is not valid')
  })
})