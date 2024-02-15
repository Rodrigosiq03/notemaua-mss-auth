import { describe, it, expect } from 'vitest'
import { User } from '../../../../src/shared/domain/entities/user'
import { CreateUserViewmodel } from '../../../../src/modules/create_user/app/create_user_viewmodel'

describe('Assert Create User viewmodel is correct at all', () => {
  it('Should activate viewmodel correctly', async () => {
    const user = new User({
      ra: '22.00680-0',
      name: 'Rodrigo Diana Siqueira',
      email: '22.00680-0@maua.br',
    })

    const userViewmodel = new CreateUserViewmodel(user.props).toJSON()

    expect(userViewmodel).toEqual({
      'ra': '22.00680-0',
      'name': 'Rodrigo Diana Siqueira',
      'email': '22.00680-0@maua.br',
      'role': 'STUDENT',
      'message': 'The user was created successfully'
    })
  })
})
