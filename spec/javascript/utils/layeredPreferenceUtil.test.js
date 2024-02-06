import {
  addLayeredPreferenceFields,
  addLayeredValidation,
  isVeteran
} from 'utils/layeredPreferenceUtil'

import {
  preferencesWithoutVeterans,
  preferencesWithVeteransInvalid,
  preferencesWithVeteransUnconfirmed,
  preferencesWithVeteransConfirmed
} from '../fixtures/layered_preferences'

describe('layeredPreferenceUtil', () => {
  describe('isVeteran', () => {
    test('should return true for preferenceName that is veteran', () => {
      // when
      const result = isVeteran('Veteran with Displaced Tenant Housing Preference (V-DTHP)')

      // then
      expect(result).toBeTruthy()
    })
    test('should return false for preferenceName that is not veteran', () => {
      // when
      const result = isVeteran('Displaced Tenant Housing Preference (DTHP)')

      // then
      expect(result).toBeFalsy()
    })
  })
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
  describe('addLayeredPreferenceFields', () => {
    test('should add preference fields to non-veteran preferences', () => {
      // when
      const layeredPreferences = addLayeredPreferenceFields(preferencesWithoutVeterans)

      // then
      expect(layeredPreferences[0].layered_validation).toBe('Confirmed')
      expect(layeredPreferences[0].layered_type_of_proofs).toHaveLength(1)
      expect(layeredPreferences[0].layered_type_of_proofs[0]).toBe('12345')
    })
    // test('should add preference fields to veteran preferences', () => {
    //   // when
    //   addLayeredPreferenceFields(preferencesWithoutVeterans)

    //   // then
    //   expect(preferencesWithoutVeterans[0].layered_validation).toBe('Confirmed')
    //   expect(preferencesWithoutVeterans[0].layered_type_of_proofs).toHaveLength(1)
    //   expect(preferencesWithoutVeterans[0].layered_type_of_proofs[0]).toBe('12345')
    // })
  })
})
