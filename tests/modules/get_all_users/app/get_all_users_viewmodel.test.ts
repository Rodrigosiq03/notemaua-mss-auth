import { describe, it, expect } from 'vitest'
import { User } from '../../../../src/shared/domain/entities/user'
import { GetAllUsersViewmodel, UserViewmodel } from '../../../../src/modules/get_all_users/app/get_all_users_viewmodel'
import { STATE } from '../../../../src/shared/domain/enums/state_enum'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'

describe('Assert Get All Users viewmodel is correct at all', () => {
  const users = [
    new User({ ra: '22.00000-0', email: '22.00000-0@maua.br', name: 'user1', password: 'Teste123$', role: ROLE.STUDENT }),
    new User({ ra: '22.11111-1', email: '22.11111-1@maua.br', name: 'user2', password: 'Teste123$', role: ROLE.STUDENT })
  ]

  it('Should activate GetAllUsers viewmodel correctly', async () => {
    const viewmodel = new GetAllUsersViewmodel(users)

    const expected = {
      'users': [
        {
          'ra': '22.00000-0',
          'name': 'user1',
          'email': '22.00000-0@maua.br',
          'role': 'STUDENT',
        },
        {
          'ra': '22.11111-1',
          'name': 'user2',
          'email': '22.11111-1@maua.br',
          'role': 'STUDENT'
        },
      ],
      'message': 'All users have been retrieved successfully',
    }

    expect(viewmodel.toJSON()).toEqual(expected)
  })

  it('Should activate Users viewmodel correctly', async () => {
    const viewmodel = new UserViewmodel(users[0])

    const expected = {
      'ra': '22.00000-0',
      'name': 'user1',
      'email': '22.00000-0@maua.br',
      'role': 'STUDENT',
    }

    expect(viewmodel.toJSON()).toEqual(expected)
  })
})