import {
  addLayeredValidation,
  isVeteran,
  addLayeredPreferenceFields
} from 'utils/layeredPreferenceUtil'

import {
  preferencesWithoutVeterans,
  preferencesWithVeteransInvalid,
  preferencesWithVeteransUnconfirmed,
  preferencesWithVeteransConfirmed,
  applicationMembers
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
      const layeredPreferences = addLayeredValidation(preferencesWithoutVeterans)

      // then
      expect(layeredPreferences[0].layered_validation).toBe('Confirmed')
      expect(layeredPreferences[1].layered_validation).toBe('Unconfirmed')
    })
    test('should invalidate veteran when non-veteran is invalid', () => {
      // when
      const layeredPreferences = addLayeredValidation(preferencesWithVeteransInvalid)

      // then
      expect(layeredPreferences[0].layered_validation).toBe('Invalid')
      expect(layeredPreferences[1].layered_validation).toBe('Invalid')
    })
    test('should unconfirm veteran when non-veteran is unconfirmed', () => {
      // when
      const layeredPreferences = addLayeredValidation(preferencesWithVeteransUnconfirmed)

      // then
      expect(layeredPreferences[0].layered_validation).toBe('Unconfirmed')
      expect(layeredPreferences[1].layered_validation).toBe('Unconfirmed')
    })
    test('should confirm veteran when non-veteran is confirmed', () => {
      // when
      const layeredPreferences = addLayeredValidation(preferencesWithVeteransConfirmed)

      // then
      expect(layeredPreferences[0].layered_validation).toBe('Confirmed')
      expect(layeredPreferences[1].layered_validation).toBe('Confirmed')
    })
  })
  describe('addLayeredPreferenceFields', () => {
    test('should add preference fields to non-veteran preferences', () => {
      // given
      const proofFiles = []
      const fileBaseUrl = ''

      // when
      const layeredPreferences = addLayeredPreferenceFields(
        preferencesWithoutVeterans,
        proofFiles,
        fileBaseUrl,
        applicationMembers
      )

      // then
      expect(layeredPreferences[0].layered_validation).toBe('Confirmed')

      expect(layeredPreferences[0].layered_type_of_proofs).toHaveLength(1)
      expect(layeredPreferences[0].layered_type_of_proofs[0]).toBe('12345')

      expect(layeredPreferences[0].layered_member_names).toHaveLength(1)
      expect(layeredPreferences[0].layered_member_names[0]).toBe('John Doe')
    })
    test('should add preference fields to veteran preferences', () => {
      // given
      const proofFiles = []
      const fileBaseUrl = ''

      // when
      const layeredPreferences = addLayeredPreferenceFields(
        preferencesWithVeteransUnconfirmed,
        proofFiles,
        fileBaseUrl,
        applicationMembers
      )

      // then
      expect(layeredPreferences[0].layered_validation).toBe('Unconfirmed')
      expect(layeredPreferences[0].layered_type_of_proofs).toHaveLength(2)
      expect(layeredPreferences[0].layered_type_of_proofs[0]).toBe('DD Form 214')
      expect(layeredPreferences[0].layered_type_of_proofs[1]).toBe('12345')

      expect(layeredPreferences[1].layered_validation).toBe('Unconfirmed')
      expect(layeredPreferences[1].layered_type_of_proofs).toHaveLength(1)
      expect(layeredPreferences[1].layered_type_of_proofs[0]).toBe('12345')
    })
  })
})
