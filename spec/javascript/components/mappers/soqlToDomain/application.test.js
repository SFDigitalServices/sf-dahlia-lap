// TODO: Expand these tests to test all fields in application.
import { mapApplication } from '~/components/mappers/soqlToDomain'
import soqlApplication from '../../../fixtures/application'

describe('mapApplication', () => {
  test('it should create dempgraphics based on primary applicant values', async () => {
    soqlApplication.Ethnicity = 'Decline to state'
    soqlApplication.Race = 'Decline to state'
    soqlApplication.Gender = 'Decline to state'
    soqlApplication.Gender_Other = 'gender other'
    soqlApplication.Sexual_Orientation = 'Decline to state'
    soqlApplication.Sexual_Orientation_Other = 'sexual orientation other'

    const mappedApplication = mapApplication(soqlApplication)

    const expectedDomainDemographics = {
      'ethnicity': 'Decline to state',
      'gender': 'Decline to state',
      'gender_other': 'gender other',
      'race': 'Decline to state',
      'sexual_orientation': 'Decline to state',
      'sexual_orientation_other': 'sexual orientation other'
    }
    expect(mappedApplication['demographics']).toEqual(expectedDomainDemographics)
  })
})
