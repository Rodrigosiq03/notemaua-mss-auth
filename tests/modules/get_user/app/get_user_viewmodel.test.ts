import { it, expect, describe,  } from 'vitest'
import { User } from '../../../../src/shared/domain/entities/user'
import { GetUserViewmodel } from '../../../../src/modules/get_user/app/get_user_viewmodel'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert Get User viewmodel is correct at all', () => {
  it('Assert the viewmodel is correct at all', () => {
    const user = new User({
      ra: '22.00000-0',
      name: 'user10',
      email: 'user10@gmail.com',
      role: ROLE.STUDENT,
      password: 'Teste123$',
    })

    const userViewmodel = new GetUserViewmodel(user.props).toJSON()

    expect(userViewmodel).toEqual({
      'ra': '22.00000-0',
      'name': 'user10',
      'email': 'user10@gmail.com',
      'role': 'STUDENT',
      'message': 'The user was retrieved successfully'
    })
  })
})