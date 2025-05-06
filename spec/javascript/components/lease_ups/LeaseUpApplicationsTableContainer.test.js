import {
  buildRowData,
  getAccessibilityKeys
} from 'components/lease_ups/LeaseUpApplicationsTableContainer'

describe('LeaseUpApplicationsTableContainer', () => {
  describe('buildRowData', () => {
    test('sets the preference key in the pref rank as expected', async () => {
      const application = {
        application_id: 'a0o4U00000KLfleQAD',
        preference_order: 1,
        preference_name: 'Right to Return - Sunnydale',
        preference_record_type: 'AG',
        preference_lottery_rank: 13
      }
      expect(buildRowData(application).preference_rank).toBe('RtR 13')
      application.preference_name = 'General'
      expect(buildRowData(application).preference_rank).toBe('General 13')
      application.preference_name = 'Alice Griffith'
      expect(buildRowData(application).preference_rank).toBe('AG 13')
      application.preference_name = 'Tier 1 General Pool'
      application.custom_preference_type = 'T1-G'
      expect(buildRowData(application).preference_rank).toBe('T1-General 13')
    })
  })

  describe('getAccessibilityKeys', () => {
    test('has hcbs_units selected', async () => {
      const application = {
        application_id: 'a0o4U00000KLfleQAD',
        preference_order: 1,
        preference_name: 'Right to Return - Sunnydale',
        preference_record_type: 'AG',
        preference_lottery_rank: 13,
        has_ada_priorities_selected: {
          hcbs_units: true
        }
      }
      expect(getAccessibilityKeys(application)).toBe('HCBS Units')
    })

    test('has hcbs_units and mobility selected', async () => {
      const application = {
        application_id: 'a0o4U00000KLfleQAD',
        preference_order: 1,
        preference_name: 'Right to Return - Sunnydale',
        preference_record_type: 'AG',
        preference_lottery_rank: 13,
        has_ada_priorities_selected: {
          hcbs_units: true,
          mobility_impairments: true
        }
      }
      expect(getAccessibilityKeys(application)).toBe('HCBS Units, Mobility')
    })
  })
})
