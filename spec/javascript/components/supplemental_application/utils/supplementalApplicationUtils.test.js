import { getPrefProofCutoff } from 'components/supplemental_application/utils/supplementalApplicationUtils'

describe('supplementalApplicationUtils', () => {
  describe('getPrefProofCutoff', () => {
    test('it returns a formatted date string 45 days before provided date', () => {
      expect(getPrefProofCutoff('2020-10-13')).toBe('August 29th, 2020')
      expect(getPrefProofCutoff('2021-01-15')).toBe('December 1st, 2020')
    })
  })
})
