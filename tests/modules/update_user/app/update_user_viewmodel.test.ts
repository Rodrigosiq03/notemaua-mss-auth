import { describe, it, expect } from 'vitest'
import { UpdateUserViewmodel } from '../../../../src/modules/update_user/app/update_user_viewmodel'
import { User } from '../../../../src/shared/domain/entities/user'

describe('Assert Update User viewmodel is correct at all', () => {
  it('Should activate viewmodel for password updated correctly', async () => {
    const user = new User({
      ra: '22.00000-0',
      name: 'user10',
      email: 'user10@gmail.com',
      password: 'Teste123$'
    })

    const userViewmodel = new UpdateUserViewmodel(user.props).toJSON()

    expect(userViewmodel).toEqual({
      'ra': '22.00000-0',
      'name': 'user10',
      'email': 'user10@gmail.com',
      'role': 'STUDENT',
      'message': 'Your password was updated successfully'
    })
  })
})
