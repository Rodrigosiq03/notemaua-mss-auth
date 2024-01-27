import { it, expect, describe } from 'vitest'
import { User } from '../../../../src/shared/domain/entities/user'
import { ROLE } from '../../../../src/shared/domain/enums/role_enum'
import { LoginViewmodel } from '../../../../src/modules/login/app/login_viewmodel'
import { hash } from 'bcryptjs'

describe('Assert Get User viewmodel is correct at all', () => {
  it('Assert the viewmodel is correct at all', async () => {
    const token = await hash('Teste123$', 6)

    const loginViewmodel = new LoginViewmodel(token).toJSON()

    expect(loginViewmodel).toEqual({
      'token': token,
      'message': 'User logged in successfully'
    })
  })
})