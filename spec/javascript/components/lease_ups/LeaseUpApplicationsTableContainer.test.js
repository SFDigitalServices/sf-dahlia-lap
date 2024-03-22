import { buildRowData } from 'components/lease_ups/LeaseUpApplicationsTableContainer'

describe('LeaseUpApplicationsTableContainer', () => {
  describe('buildRowData', () => {
    test('sets the preference key in the pref rank as expected', async () => {
      const application = {
        application_id: 'a0o4U00000KLfleQAD',
        preference_order: 1,
        preference_name: 'Right to Return - Sunnydale',
        custom_preference_type: 'AG',
        preference_lottery_rank: 13
      }
      expect(buildRowData(application).preference_rank).toBe('RtR 13')
      application.preference_name = 'General'
      expect(buildRowData(application).preference_rank).toBe('General 13')
      application.preference_name = 'Alice Griffith'
      expect(buildRowData(application).preference_rank).toBe('AG 13')
    })
  })
})
