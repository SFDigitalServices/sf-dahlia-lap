import { addLayeredValidation } from 'utils/layeredPreferenceUtil'

import {
  preferencesWithoutVeterans,
  preferencesWithVeteransInvalid,
  preferencesWithVeteransUnconfirmed,
  preferencesWithVeteransConfirmed
} from '../fixtures/layered_preferences'

describe('layeredPreferenceUtil', () => {
  describe('addLayeredValidation', () => {
    test('should add layered_validation to non-veteran preferences which match post_lottery_validation', () => {
      // when
      addLayeredValidation(preferencesWithoutVeterans)

      // then
      expect(preferencesWithoutVeterans[0].layered_validation).toBe('Confirmed')
      expect(preferencesWithoutVeterans[1].layered_validation).toBe('Unconfirmed')
    })
    test('should invalidate veteran when non-veteran is invalid', () => {
      // when
      addLayeredValidation(preferencesWithVeteransInvalid)

      // then
      expect(preferencesWithVeteransInvalid[0].layered_validation).toBe('Invalid')
      expect(preferencesWithVeteransInvalid[1].layered_validation).toBe('Invalid')
    })
    test('should unconfirm veteran when non-veteran is unconfirmed', () => {
      // when
      addLayeredValidation(preferencesWithVeteransUnconfirmed)

      // then
      expect(preferencesWithVeteransUnconfirmed[0].layered_validation).toBe('Unconfirmed')
      expect(preferencesWithVeteransUnconfirmed[1].layered_validation).toBe('Unconfirmed')
    })
    test('should confirm veteran when non-veteran is confirmed', () => {
      // when
      addLayeredValidation(preferencesWithVeteransConfirmed)

      // then
      expect(preferencesWithVeteransConfirmed[0].layered_validation).toBe('Confirmed')
      expect(preferencesWithVeteransConfirmed[1].layered_validation).toBe('Confirmed')
    })
  })
})
