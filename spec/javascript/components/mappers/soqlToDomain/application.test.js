// TODO: Expand these tests to use fixtures, test all fields in application.
import { mapApplication } from '~/components/mappers/soqlToDomain'
import soqlApplication from '../../../fixtures/application'
import domainApplication from '../../../fixtures/domain_application'

describe('mapApplication', () => {
  test('it should build map soql application to domain', async () => {
    const mappedApplication = mapApplication(soqlApplication)
    expect(mappedApplication).toEqual(domainApplication)
  })
})
