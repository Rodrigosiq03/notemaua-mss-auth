import { describe, it, expect } from 'vitest'
import { User } from '../../../../src/shared/domain/entities/user'
import { DeleteUserViewmodel } from '../../../../src/modules/delete_user/app/delete_user_viewmodel'

describe('Assert Delete User viewmodel is correct at all', () => {
  it('Should activate viewmodel correctly', async () => {
    const user = new User({ ra: '22.00680-0', name: 'usuario1', email: '22.00680-0@maua.br', })

    const viewmodel = new DeleteUserViewmodel(user)

    const expected = {
      'ra': '22.00680-0',
      'message': 'The user was deleted successfully'
    }

    expect(viewmodel.toJSON()).toEqual(expected)
  })
})