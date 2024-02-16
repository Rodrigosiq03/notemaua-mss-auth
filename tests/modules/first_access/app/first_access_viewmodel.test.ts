import { it, expect, describe,  } from 'vitest'
import { FirstAccessViewmodel } from '../../../../src/modules/first_access/app/first_access_viewmodel'

describe('Assert First access viewmodel is correct at all', () => {
  it('Assert the viewmodel is correct at all', () => {
    const firstAccessViewmodel = new FirstAccessViewmodel().toJSON()

    expect(firstAccessViewmodel).toEqual({
      'message': 'A new password has been sent to your email. Please check it.'
    })
  })
})