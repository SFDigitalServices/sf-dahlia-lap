import { cloneDeep, merge } from 'lodash'
import { act } from 'react-dom/test-utils'
import renderer from 'react-test-renderer'

import supplementalApplication from '../../fixtures/supplemental_application'
import { leaseUpAppWithUrl, mountAppWithUrl } from '../../testUtils/wrapperUtil'

const mockInitialLoad = jest.fn()
const mockSubmitApplication = jest.fn()
const mockUpdateApplication = jest.fn()
const mockUpdatePreference = jest.fn()
const mockCreateLease = jest.fn()
const mockUpdateLease = jest.fn()
const mockGetRentalAssistances = jest.fn()
window.scrollTo = jest.fn()

const getMockApplication = () => cloneDeep(supplementalApplication)

const getWindowUrl = (id) => `/lease-ups/applications/${id}/supplemental`

const ID_NO_AVAILABLE_UNITS = 'idwithnoavailableunits'
const ID_WITH_TOTAL_MONTHLY_RENT = 'idwithtotalmonthlyrent'
const ID_WITH_SELECTED_UNIT = 'idwithselectedunit'

jest.mock('apiService', () => {
  const mockedApplication = require('../../fixtures/supplemental_application').default
  const mockedListing = require('../../fixtures/listing').default
  const mockedUnits = require('../../fixtures/units').default
  const _merge = require('lodash').merge
  const _cloneDeep = require('lodash').cloneDeep
  const _ID_NO_AVAILABLE_UNITS = 'idwithnoavailableunits'
  const _ID_WITH_TOTAL_MONTHLY_RENT = 'idwithtotalmonthlyrent'
  const _ID_WITH_SELECTED_UNIT = 'idwithselectedunit'

  return {
    getSupplementalPageData: async (applicationId) => {
      mockInitialLoad(applicationId)

      const appWithPrefs = _cloneDeep(mockedApplication)

      if (applicationId === _ID_WITH_TOTAL_MONTHLY_RENT) {
        appWithPrefs.total_monthly_rent = '50'
      }
      if (applicationId === _ID_WITH_SELECTED_UNIT) {
        appWithPrefs.lease.unit = 'id1'
      } else {
        appWithPrefs.lease.unit = null
      }

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

      const occupiedUnit = _merge(_cloneDeep(mockedUnits[0]), {
        id: 'idOccupied',
        unit_number: 'occupied',
        unit_type: 'studio',
        priority_type: null,
        max_ami_for_qualifying_unit: 50,
        application_id: 'other application'
      })

      _merge(appWithPrefs.preferences[2], {
        id: 'validDTHPPref',
        post_lottery_validation: 'Confirmed'
      })

      return {
        application: appWithPrefs,
        statusHistory: [],
        fileBaseUrl: 'fileBaseUrl',
        units:
          applicationId === _ID_NO_AVAILABLE_UNITS
            ? [occupiedUnit]
            : [
                occupiedUnit,
                _merge(mockedUnits[0], {
                  id: 'unit_without_priority',
                  unit_number: 'unit without priority',
                  priority_type: null,
                  max_ami_for_qualifying_unit: 50
                }),
                _merge(mockedUnits[1], {
                  id: 'unit_with_priority',
                  unit_number: 'unit with priority',
                  priority_type: 'Hearing/Vision impairments',
                  max_ami_for_qualifying_unit: 50
                })
              ]
      }
    },

    getLeaseUpListing: async (listingId) => _cloneDeep(mockedListing),

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
    createRentalAssistance: async (_) => ({}),
    updateRentalAssistance: async (_) => ({})
  }
})

const getWrapper = async (id = getMockApplication().id, unitId = null) => {
  let wrapper
  await act(async () => {
    wrapper = mountAppWithUrl(getWindowUrl(id))
  })

  wrapper.update()

  return wrapper
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
      component = renderer.create(leaseUpAppWithUrl(getWindowUrl(getMockApplication().id)))
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

      // Click edit to open up the panel
      act(() => {
        wrapper.find('.preferences-table .action-link').at(2).simulate('click')
      })
      // Save the preference panel without making updates
      await act(async () => {
        wrapper.find('.preferences-table .save-panel-btn').at(2).simulate('click')
      })

      const expectedPreferencePayload = {
        individual_preference: 'Live in SF',
        lw_type_of_proof: 'Telephone bill'
      }

      expect(mockUpdateApplication.mock.calls).toHaveLength(0)
      expect(mockUpdatePreference.mock.calls).toHaveLength(1)
      // Additional fields are sent to the API, but these are the fields that we care about.
      expect(mockUpdatePreference).toHaveBeenCalledWith(
        expect.objectContaining(expectedPreferencePayload)
      )
    })

    test('it updates total monthly rent when saving a rent burdened preference panel', async () => {
      const wrapper = await getWrapper(ID_WITH_TOTAL_MONTHLY_RENT)

      // Click edit to open up the panel
      wrapper.find('.preferences-table .action-link').first().simulate('click')
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

      act(() => {
        wrapper
          .find('input#form-confirmed_household_annual_income')
          .simulate('change', { target: { value: '1234' } })
      })

      act(() => {
        wrapper.find('input#form-confirmed_household_annual_income').simulate('focus')
      })

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

      act(() => {
        wrapper
          .find('input#form-confirmed_household_annual_income')
          .simulate('change', { target: { value: '' } })

        wrapper.find('input#form-confirmed_household_annual_income').simulate('focus')
      })

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
        id: 'validDTHPPref',
        post_lottery_validation: 'Confirmed'
      })

      wrapper = await getWrapper()
    })

    test('should save a lease object', async () => {
      wrapper.find('#edit-lease-button').first().simulate('click')
      // Fill out lease fields
      // Assigned Unit number

      // Lease start date
      act(() => {
        wrapper
          .find('#form-lease_unit')
          .find('Select')
          .instance()
          .props.onChange({ value: 'unit_without_priority' })

        wrapper.find('#lease_start_date_month input').simulate('change', { target: { value: '1' } })
        wrapper.find('#lease_start_date_day input').simulate('change', { target: { value: '12' } })

        wrapper
          .find('#lease_start_date_year input')
          .simulate('change', { target: { value: '2019' } })

        // Preference used
        wrapper
          .find('[name="lease.preference_used"] select option[value="validDTHPPref"]')
          .simulate('change')
      })
      wrapper.update()

      // Costs

      // need to set this to "Yes" first to be able to access the other parking cost fields.
      wrapper
        .find('[name="lease.bmr_parking_space_assigned"] select')
        .at(0)
        .simulate('change', { target: { value: 'Yes' } })

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
        bmr_parking_space_assigned: 'Yes',
        unit: 'unit_without_priority',
        lease_start_date: { year: '2019', month: '1', day: '12' },
        lease_status: 'Draft',
        no_preference_used: false,
        preference_used: 'validDTHPPref',
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
      const wrapper = await getWrapper(ID_WITH_SELECTED_UNIT)
      wrapper.find('#edit-lease-button').first().simulate('click')

      // Select the value from the dropdown

      act(() => {
        wrapper.find('#form-lease_unit').find('Select').instance().props.onChange({ value: null })
      })
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

    test('it displays "No Units Available" and 0 units count when no units available', async () => {
      const wrapper = await getWrapper(ID_NO_AVAILABLE_UNITS)
      const unitSelect = wrapper.find('#form-lease_unit').first()

      expect(unitSelect.exists()).toBeTruthy()
      expect(unitSelect.html().includes('No Units Available')).toBeTruthy()
      expect(wrapper.find('#total-available-count').text()).toEqual('0')
    })

    describe('when no unit is selected', () => {
      test('it shows expected available unit counts', () => {
        expect(wrapper.find('#total-available-count').text()).toEqual('2')
        expect(wrapper.find('#accessibility-available-count').text()).toEqual('1')
        expect(wrapper.find('#dthp-available-count').text()).toEqual('3')
        expect(wrapper.find('#nrhp-available-count').text()).toEqual('4')
      })

      test('it does not change the DTHP availability count when pref used is selected', () => {
        act(() => {
          wrapper
            .find('[name="lease.preference_used"] select')
            .simulate('change', { target: { value: 'validDTHPPref' } })
        })
        expect(wrapper.find('#dthp-available-count').text()).toEqual('3')
      })
    })

    describe('when unit without priority is selected', () => {
      beforeEach(async () => {
        wrapper.find('#edit-lease-button').first().simulate('click')
        act(() => {
          wrapper
            .find('#form-lease_unit')
            .find('Select')
            .instance()
            .props.onChange({ value: 'unit_without_priority' })
        })
        wrapper.update()
      })

      test('it decreases the number of available units', () => {
        expect(wrapper.find('#total-available-count').text()).toEqual('1')
      })

      test('it does not impact the number of accessibility units', () => {
        expect(wrapper.find('#accessibility-available-count').text()).toEqual('1')
      })

      test('it does not impact the number of priority set asides', () => {
        expect(wrapper.find('#dthp-available-count').text()).toEqual('3')
        expect(wrapper.find('#nrhp-available-count').text()).toEqual('4')
      })

      test('it decreases the available DTHP count when DTHP is pref used', () => {
        act(() => {
          wrapper
            .find('[name="lease.preference_used"] select')
            .simulate('change', { target: { value: 'validDTHPPref' } })
        })
        expect(wrapper.find('#dthp-available-count').text()).toEqual('2')
      })
    })

    describe('when unit with priority is selected', () => {
      beforeEach(async () => {
        wrapper.find('#edit-lease-button').first().simulate('click')
        act(() => {
          wrapper
            .find('#form-lease_unit')
            .find('Select')
            .instance()
            .props.onChange({ value: 'unit_with_priority' })
        })
        wrapper.update()
      })

      test('it decreases the number of available units', () => {
        expect(wrapper.find('#total-available-count').text()).toEqual('1')
      })

      test('it decreases the number of accessibility units', () => {
        expect(wrapper.find('#accessibility-available-count').text()).toEqual('0')
      })
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

    act(() => {
      wrapper
        .find('#lease_start_date_month')
        .first()
        .simulate('change', { target: { value: 'AB' } })
    })
    wrapper.find('#save-supplemental-application').first().simulate('click')

    // alert box to display
    expect(wrapper.find('.alert-box').exists()).toBeTruthy()
  })
})
