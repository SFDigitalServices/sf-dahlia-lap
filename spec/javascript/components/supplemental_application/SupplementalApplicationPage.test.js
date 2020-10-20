import renderer from 'react-test-renderer'
import { act } from 'react-dom/test-utils'
import { cloneDeep, merge } from 'lodash'
import { leaseUpAppWithUrl, mountAppWithUrl } from '../../testUtils/wrapperUtil'
import supplementalApplication from '../../fixtures/supplemental_application'

const mockInitialLoad = jest.fn()
const mockSubmitApplication = jest.fn()
const mockUpdateApplication = jest.fn()
const mockUpdatePreference = jest.fn()
const mockCreateLease = jest.fn()
const mockUpdateLease = jest.fn()
const mockGetRentalAssistances = jest.fn()
window.scrollTo = jest.fn()

const getMockApplication = () => cloneDeep(supplementalApplication)

const WINDOW_URL = `/lease-ups/applications/${getMockApplication().id}/supplemental`

jest.mock('apiService', () => {
  const mockedApplication = require('../../fixtures/supplemental_application').default
  const mockedUnits = require('../../fixtures/units').default
  const _merge = require('lodash').merge
  const _cloneDeep = require('lodash').cloneDeep
  return {
    getSupplementalPageData: async (applicationId) => {
      mockInitialLoad(applicationId)

      const appWithPrefs = _cloneDeep(mockedApplication)
      _merge(appWithPrefs.preferences[0], {
        preference_name: 'Rent Burdened Assisted Housing',
        individual_preference: 'Rent Burdened',
        receives_preference: true,
        type_of_proof: 'Lease and rent proof',
        application_member_id: 'xxx',
        id: 'preference_id',
        post_lottery_validation: 'Unconfirmed',
        name: 'AP-1234',
        recordtype_developername: 'RB_AHP'
      })

      _merge(appWithPrefs.preferences[1], {
        id: 'testValidPref',
        post_lottery_validation: 'Confirmed'
      })
      return {
        application: appWithPrefs,
        statusHistory: [],
        fileBaseUrl: 'fileBaseUrl',
        units: _cloneDeep(mockedUnits),
        availableUnits: [
          {
            id: 'id1',
            unit_number: '123',
            unit_type: 'studio',
            priority_type: null,
            max_ami_for_qualifying_unit: 50,
            ami_chart_type: 'HUD'
          },
          {
            id: 'id2',
            unit_number: '100',
            unit_type: 'studio',
            priority_type: null,
            max_ami_for_qualifying_unit: 50,
            ami_chart_type: 'HUD'
          }
        ]
      }
    },
    submitApplication: async (application) => {
      mockSubmitApplication(application)
      return _merge(_cloneDeep(mockedApplication), application)
    },
    updateApplication: async (data) => {
      mockUpdateApplication(data)
      return true
    },
    updatePreference: async (data) => {
      mockUpdatePreference(data)
      return true
    },
    getAMI: async (data) => {
      return {
        ami: [{ chartType: data.chartType, year: data.chartYear, amount: 100, numOfHousehold: 1 }]
      }
    },
    createLease: async (lease, contact, applicationId) => {
      const leaseWithNewFields = {
        ...lease,
        primary_applicant_contact: contact
      }

      mockCreateLease(leaseWithNewFields)
      return leaseWithNewFields
    },
    updateLease: async (lease, contact, applicationId) => {
      const leaseWithNewFields = {
        ...lease,
        primary_applicant_contact: contact
      }

      mockUpdateLease(leaseWithNewFields)
      return leaseWithNewFields
    },
    getRentalAssistances: async (applicationId) => {
      mockGetRentalAssistances(applicationId)
      return []
    },
    createRentalAssistance: async (applicationId) => ({}),
    updateRentalAssistance: async (applicationId) => ({})
  }
})

const getWrapper = async () => {
  let wrapper
  await act(async () => {
    wrapper = mountAppWithUrl(WINDOW_URL)
  })

  wrapper.update()

  return wrapper
}

const setStateOnWrapper = async (wrapper, prevStateToNewStateFunction) => {
  await act(async () => {
    wrapper.find('SupplementalApplicationPage').setState(prevStateToNewStateFunction)
  })

  wrapper.update()
}

describe('SupplementalApplicationPage', () => {
  const originalLocation = window.location
  beforeEach(() => {
    jest.clearAllMocks()

    delete window.location
    window.location = {
      href: '/',
      reload: jest.fn(),
      hash: ''
    }
  })

  afterEach(() => {
    window.location = originalLocation
  })

  test('it should render as expected', async () => {
    let component
    await renderer.act(async () => {
      component = renderer.create(leaseUpAppWithUrl(WINDOW_URL))
    })

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it only performs initial load request if nothing is changed', async () => {
    const wrapper = await getWrapper()
    await act(async () => {
      wrapper.find('form').first().simulate('submit')
    })

    expect(mockInitialLoad.mock.calls).toHaveLength(1)
    expect(mockSubmitApplication.mock.calls).toHaveLength(0)
  })

  test('it only updates changed fields', async () => {
    const payload = getMockApplication()
    const wrapper = await getWrapper()
    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    await act(async () => {
      wrapper.find('form').first().simulate('submit')
    })
    expect(mockSubmitApplication.mock.calls).toHaveLength(1)
    expect(mockSubmitApplication).toHaveBeenCalledWith({ id: payload.id, number_of_dependents: 2 })
  })

  test('it saves demographics correctly', async () => {
    const expectedDemographics = {
      number_of_dependents: 2,
      number_of_seniors: 3,
      number_of_minors: 0,
      applicant: { marital_status: 'Domestic Partner' }
    }

    const wrapper = await getWrapper()

    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    wrapper.find('#demographics-seniors select option[value=3]').simulate('change')
    wrapper.find('#demographics-minors select option[value=0]').simulate('change')
    wrapper
      .find('#demographics-marital-status select option[value="Domestic Partner"]')
      .simulate('change')

    await act(async () => {
      wrapper.find('form').first().simulate('submit')
    })

    expect(mockSubmitApplication.mock.calls).toHaveLength(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toMatchObject(expectedDemographics)
  })

  describe('preference panel', () => {
    test('it saves a live/work application preference panel', async () => {
      const wrapper = await getWrapper()

      await setStateOnWrapper(wrapper, (prevState) => ({
        application: {
          ...prevState.application,
          preferences: [
            merge(prevState.application.preferences[0], {
              id: 'preference_id',
              application_member_id: 'xxx',
              individual_preference: 'Live in SF',
              type_of_proof: null,
              lw_type_of_proof: 'Water bill',
              post_lottery_validation: 'Unconfirmed'
            })
          ]
        }
      }))

      // Click edit to open up the panel
      await wrapper.find('.preferences-table .action-link').first().simulate('click')
      // Save the preference panel without making updates
      await act(async () => {
        wrapper.find('.preferences-table .save-panel-btn').first().simulate('click')
      })

      const expectedPreferencePayload = {
        id: 'preference_id',
        application_member_id: 'xxx',
        individual_preference: 'Live in SF',
        type_of_proof: null,
        lw_type_of_proof: 'Water bill',
        post_lottery_validation: 'Unconfirmed'
      }

      expect(mockUpdateApplication.mock.calls).toHaveLength(0)
      expect(mockUpdatePreference.mock.calls).toHaveLength(1)
      // Additional fields are sent to the API, but these are the fields that we care about.
      expect(mockUpdatePreference).toHaveBeenCalledWith(
        expect.objectContaining(expectedPreferencePayload)
      )
    })

    test('it updates total monthly rent when saving a rent burdened preference panel', async () => {
      const wrapper = await getWrapper()

      await setStateOnWrapper(wrapper, (prevState) => ({
        application: { ...prevState.application, total_monthly_rent: '50' }
      }))

      // Click edit to open up the panel
      await wrapper.find('.preferences-table .action-link').first().simulate('click')
      // Save the preference panel without making updates
      await act(async () => {
        wrapper.find('.preferences-table .save-panel-btn').first().simulate('click')
      })

      const expectedPreferencePayload = {
        application_member_id: 'xxx',
        id: 'preference_id',
        individual_preference: 'Rent Burdened',
        listing_preference_id: 'a0l0P00001Q1vxUQAR',
        lottery_status: null,
        name: 'AP-1234',
        post_lottery_validation: 'Unconfirmed',
        preference_name: 'Rent Burdened Assisted Housing',
        preference_order: 1,
        receives_preference: true,
        recordtype_developername: 'RB_AHP',
        type_of_proof: 'Lease and rent proof'
      }
      expect(mockUpdateApplication.mock.calls).toHaveLength(1)
      expect(mockUpdatePreference.mock.calls).toHaveLength(1)
      expect(mockUpdatePreference).toHaveBeenCalledWith(
        expect.objectContaining(expectedPreferencePayload)
      )
      expect(mockUpdateApplication).toHaveBeenCalledWith({
        id: getMockApplication().id,
        total_monthly_rent: '50'
      })
    })
  })

  describe('confirmed income section', () => {
    test('currencies are converted to floats on save', async () => {
      const application = getMockApplication()
      const wrapper = await getWrapper()
      wrapper
        .find('input#form-confirmed_household_annual_income')
        .simulate('change', { target: { value: '1234' } })
      wrapper.find('input#form-confirmed_household_annual_income').simulate('focus')

      await act(async () => {
        wrapper.find('form').first().simulate('submit')
      })

      const expectedApplication = { id: application.id }
      expectedApplication.confirmed_household_annual_income = 1234.0

      expect(mockSubmitApplication.mock.calls).toHaveLength(1)
      expect(mockSubmitApplication).toHaveBeenCalledWith(expectedApplication)
    })

    test('converts empty values to null when touched', async () => {
      const application = getMockApplication()
      const wrapper = await getWrapper()
      wrapper
        .find('input#form-confirmed_household_annual_income')
        .simulate('change', { target: { value: '' } })
      wrapper.find('input#form-confirmed_household_annual_income').simulate('focus')

      const expectedApplication = { id: application.id }
      expectedApplication.confirmed_household_annual_income = null

      await act(async () => {
        wrapper.find('form').first().simulate('submit')
      })
      expect(mockSubmitApplication.mock.calls).toHaveLength(1)
      expect(mockSubmitApplication).toHaveBeenCalledWith(expectedApplication)
    })
  })

  describe('Lease Section', () => {
    let wrapper, mockApplication
    beforeEach(async () => {
      mockApplication = getMockApplication()

      // Add a valid preference for preference used
      merge(mockApplication.preferences[0], {
        id: 'testValidPref',
        post_lottery_validation: 'Confirmed'
      })

      wrapper = await getWrapper()
    })

    test('should save a lease object', async () => {
      wrapper.find('#edit-lease-button').first().simulate('click')
      // Fill out lease fields
      // Assigned Unit number
      wrapper.find('#form-lease_unit').find('Select').instance().props.onChange({ value: 'id1' })
      wrapper.update()
      // Lease start date
      wrapper.find('#lease_start_date_month input').simulate('change', { target: { value: '1' } })
      wrapper.find('#lease_start_date_day input').simulate('change', { target: { value: '12' } })
      wrapper.find('#lease_start_date_year input').simulate('change', { target: { value: '2019' } })

      // Preference used
      wrapper
        .find('[name="lease.preference_used"] select option[value="testValidPref"]')
        .simulate('change')

      // Costs
      wrapper
        .find('[name="lease.total_monthly_rent_without_parking"] input')
        .simulate('change', { target: { value: '$1' } })
      wrapper
        .find('[name="lease.monthly_parking_rent"] input')
        .at(0)
        .simulate('change', { target: { value: '$2' } })
      wrapper
        .find('[name="lease.monthly_tenant_contribution"] input')
        .simulate('change', { target: { value: '$3' } })

      // Assert that they're sent to the API
      await act(async () => {
        wrapper.find('form').first().simulate('submit')
      })

      const expectedLease = {
        id: 'a130P000005TeZrQAK',
        bmr_parking_space_assigned: null,
        unit: 'id1',
        lease_start_date: { year: '2019', month: '1', day: '12' },
        lease_status: 'Draft',
        no_preference_used: false,
        preference_used: 'testValidPref',
        total_monthly_rent_without_parking: '1',
        monthly_parking_rent: '2',
        monthly_tenant_contribution: '3',
        primary_applicant_contact: mockApplication.applicant.id
      }

      expect(mockCreateLease.mock.calls).toHaveLength(0)
      expect(mockUpdateLease.mock.calls).toHaveLength(1)
      expect(mockUpdateLease).toHaveBeenCalledWith(expectedLease)
    })

    test('should send a null value for unit to API if selected', async () => {
      wrapper.find('#edit-lease-button').first().simulate('click')

      // Select the value from the dropdown
      wrapper.find('#form-lease_unit').find('Select').instance().props.onChange({ value: null })
      wrapper.update()

      // Hit save
      await act(async () => {
        wrapper.find('form').first().simulate('submit')
      })

      // Verify that the API was called with null unit value
      expect(mockCreateLease.mock.calls).toHaveLength(0)
      expect(mockUpdateLease.mock.calls).toHaveLength(1)
      expect(mockUpdateLease).toHaveBeenCalledWith(expect.objectContaining({ unit: null }))
    })

    test('it displays "No Units Available" when no units available', async () => {
      const wrapper = await getWrapper()
      await setStateOnWrapper(wrapper, (prevState) => ({ availableUnits: [] }))
      const unitSelect = await wrapper.find('#form-lease_unit').first()

      expect(unitSelect.exists()).toBeTruthy()
      expect(unitSelect.html().includes('No Units Available')).toBeTruthy()
    })
  })

  describe('Status Sidebar', () => {
    test('should render the LeaseUpSidebar', async () => {
      const wrapper = await getWrapper()

      // Check that the page matches the snapshot that we have stored
      // of how the dropdown button and dropdown menu should render
      // when the dropdown menu is open
      expect(wrapper.find('.sidebar-content')).toHaveLength(1)
    })
  })

  test('should display alert box when form is invalid on submit', async () => {
    const wrapper = await getWrapper()

    // Fill in letters in lease date month - which are invalid values
    wrapper
      .find('#lease_start_date_month')
      .first()
      .simulate('change', { target: { value: 'AB' } })
    wrapper.find('#save-supplemental-application').first().simulate('click')

    // alert box to display
    expect(wrapper.find('.alert-box').exists()).toBeTruthy()
  })
})
