import { getTypeOfProof } from 'components/supplemental_application/sections/preferences/typeOfProof'

describe('typeOfProof', () => {
  describe('getTypeOfProof', () => {
    test('should return certificate_number for COP preferences', () => {
      // given
      const veteranPreference = {
        preference_name: 'Certificate of Preference (COP)',
        certificate_number: 'abc123'
      }
      const proofFiles = []
      const fileBaseUrl = ''

      // when
      const typeOfProof = getTypeOfProof(veteranPreference, proofFiles, fileBaseUrl)

      // then
      expect(typeOfProof).toBe('abc123')
    })
    test('should return certificate_number for DTHP preferences', () => {
      // given
      const veteranPreference = {
        preference_name: 'Displaced Tenant Housing Preference (DTHP)',
        certificate_number: 'abc123'
      }
      const proofFiles = []
      const fileBaseUrl = ''

      // when
      const typeOfProof = getTypeOfProof(veteranPreference, proofFiles, fileBaseUrl)

      // then
      expect(typeOfProof).toBe('abc123')
    })
    test('should return veteran_type_of_proof for veteran prefernces', () => {
      // given
      const veteranPreference = {
        preference_name: 'Veteran with Certificate of Preference (V-COP)',
        veteran_type_of_proof: 'DD Form 214'
      }
      const proofFiles = []
      const fileBaseUrl = ''

      // when
      const typeOfProof = getTypeOfProof(veteranPreference, proofFiles, fileBaseUrl)

      // then
      expect(typeOfProof).toBe('DD Form 214')
    })
    test('should return lw_type_of_proof for live work prefernces', () => {
      // given
      const liveWorkPreference = {
        preference_name: 'Live or Work in San Francisco Preference',
        recordtype_developername: 'L_W',
        lw_type_of_proof: 'Cable and internet bill'
      }
      const proofFiles = []
      const fileBaseUrl = ''

      // when
      const typeOfProof = getTypeOfProof(liveWorkPreference, proofFiles, fileBaseUrl)

      // then
      console.log(typeOfProof.props.type)
      expect(typeOfProof.props.type).toBe('Cable and internet bill')
    })
  })
})
