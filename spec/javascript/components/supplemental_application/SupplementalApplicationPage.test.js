import React from 'react'
import renderer from 'react-test-renderer'
import { act } from 'react-dom/test-utils'
import { cloneDeep, merge } from 'lodash'
import { mount } from 'enzyme'
import SupplementalApplicationPage from 'components/supplemental_application/SupplementalApplicationPage'
import supplementalApplication from '../../fixtures/supplemental_application'
import units from '../../fixtures/units'
import mockShortFormSubmitPayload from '../../fixtures/short_form_submit_payload'

const mockSubmitApplication = jest.fn()
const mockUpdateApplication = jest.fn()
const mockUpdatePreference = jest.fn()
const mockCreateOrUpdateLease = jest.fn()
window.scrollTo = jest.fn()

jest.mock('apiService', () => {
  return {
    submitApplication: async (data) => {
      mockSubmitApplication(data)
      return true
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
      return { ami: [{ chartType: data.chartType, year: data.chartYear, amount: 100, numOfHousehold: 1 }] }
    },
    createOrUpdateLease: async (data) => {
      mockCreateOrUpdateLease(data)
      return true
    }
  }
})

const statusHistory = [
  { Processing_Status: 'Approved', Processing_Comment: 'xxxx1', Processing_Date_Updated: '2018-05-10T19:54:11.000+0000' },
  { Processing_Status: 'Pending', Processing_Comment: 'xxxx2', Processing_Date_Updated: '2018-05-10T19:54:11.000+0000' }
]

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
      component = renderer.create(
        <SupplementalApplicationPage
          application={supplementalApplication}
          units={units} />
      )
    })

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('it saves expected values if no changes are made', async () => {
    const payload = cloneDeep(mockShortFormSubmitPayload)
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={supplementalApplication}
          statusHistory={statusHistory}
          units={units} />
      )
    })
    await act(async () => { wrapper.find('form').first().simulate('submit') })

    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication).toHaveBeenCalledWith(payload)
  })

  test('it displays "No Units Available" when no units available', async () => {
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={supplementalApplication}
          statusHistory={statusHistory}
          units={[]} />
      )
    })
    const unitSelect = await wrapper.find('#lease_assigned_unit').first()

    expect(unitSelect.exists()).toBeTruthy()
    expect(unitSelect.html().includes('No Units Available')).toBeTruthy()
  })

  test('it saves demographics correctly', async () => {
    const payload = cloneDeep(mockShortFormSubmitPayload)
    payload.numberOfDependents = '2'
    payload.numberOfSeniors = '3'
    payload.numberOfMinors = '4'
    payload.primaryApplicant.maritalStatus = 'Domestic Partner'
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={supplementalApplication}
          statusHistory={statusHistory}
          units={units} />
      )
    })

    wrapper.find('#demographics-dependents select option[value=2]').simulate('change')
    wrapper.find('#demographics-seniors select option[value=3]').simulate('change')
    wrapper.find('#demographics-minors select option[value=4]').simulate('change')
    wrapper.find('#demographics-marital-status select option[value="Domestic Partner"]').simulate('change')

    await act(async () => { wrapper.find('form').first().simulate('submit') })

    expect(mockSubmitApplication.mock.calls.length).toBe(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toEqual(payload)
  })

  test('it saves a live/work application preference panel', async () => {
    const withValidPreferences = cloneDeep(supplementalApplication)
    merge(withValidPreferences.preferences[0], {
      Preference_Name: 'Live or Work in San Francisco Preference',
      Individual_preference: 'Live in SF',
      Receives_Preference: true,
      'RecordType.DeveloperName': 'L_W',
      LW_Type_of_Proof: 'Water bill',
      Application_Member: { Id: 'xxx', First_Name: 'Bla', Last_Name: 'Ble', DOB: '03/03/83' },
      Id: 'preference_id',
      Post_Lottery_Validation: 'Unconfirmed',
      Name: 'AP-1234'
    })

    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={withValidPreferences}
          statusHistory={statusHistory}
        />
      )
    })

    // Click edit to open up the panel
    await wrapper.find('.preferences-table .action-link').first().simulate('click')
    // Save the preference panel without making updates
    await act(async () => { wrapper.find('.preferences-table .save-panel-btn').simulate('click') })

    const expectedPreferencePayload = {
      id: 'preference_id',
      application_member_id: 'xxx',
      individual_preference: 'Live in SF',
      type_of_proof: null,
      lw_type_of_proof: 'Water bill',
      post_lottery_validation: 'Unconfirmed'
    }

    expect(mockUpdateApplication.mock.calls.length).toBe(0)
    expect(mockUpdatePreference.mock.calls.length).toBe(1)
    // Additional fields are sent to the API, but these are the fields that we care about.
    expect(mockUpdatePreference).toHaveBeenCalledWith(expect.objectContaining(expectedPreferencePayload))
  })

  test('it updates total monthly rent when saving a rent burdened preference panel', async () => {
    const withValidPreferences = cloneDeep(supplementalApplication)

    merge(withValidPreferences.preferences[0], {
      Preference_Name: 'Rent Burdened Assisted Housing',
      Individual_preference: 'Rent Burdened',
      Receives_Preference: true,
      Type_of_proof: 'Lease and rent proof',
      Application_Member: { Id: 'xxx', First_Name: 'Bla', Last_Name: 'Ble', DOB: '03/03/83' },
      Id: 'preference_id',
      Post_Lottery_Validation: 'Unconfirmed',
      Name: 'AP-1234',
      'RecordType.DeveloperName': 'RB_AHP'
    })

    withValidPreferences.Id = 'application_id'
    withValidPreferences.Total_Monthly_Rent = '50'
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={withValidPreferences}
          statusHistory={statusHistory}
        />
      )
    })

    // Click edit to open up the panel
    await wrapper.find('.preferences-table .action-link').first().simulate('click')
    // Save the preference panel without making updates
    await act(async () => { wrapper.find('.preferences-table .save-panel-btn').simulate('click') })

    const expectedPreferencePayload = {
      id: 'preference_id',
      application_member_id: 'xxx',
      individual_preference: 'Rent Burdened',
      type_of_proof: 'Lease and rent proof',
      lw_type_of_proof: null,
      post_lottery_validation: 'Unconfirmed'
    }
    expect(mockUpdateApplication.mock.calls.length).toBe(1)
    expect(mockUpdatePreference.mock.calls.length).toBe(1)
    expect(mockUpdatePreference).toHaveBeenCalledWith(expect.objectContaining(expectedPreferencePayload))
    expect(mockUpdateApplication).toHaveBeenCalledWith({'id': 'application_id', 'total_monthly_rent': '$50.00'})
  })

  describe('Lease Section', () => {
    let wrapper, mockApplication
    beforeEach(async () => {
      mockApplication = cloneDeep(supplementalApplication)

      // Add a valid preference for preference used
      merge(mockApplication.preferences[0], {
        Id: 'testValidPref',
        Post_Lottery_Validation: 'Confirmed'
      })

      // Add available units
      const mockAvailableUnits = [
        {'Unit_Number': 1, 'Id': 'id1'},
        {'Unit_Number': 2, 'Id': 'id2'}
      ]

      await act(async () => {
        wrapper = mount(
          <SupplementalApplicationPage
            application={mockApplication}
            statusHistory={statusHistory}
            availableUnits={mockAvailableUnits} />
        )
      })
    })

    test('should save a lease object', async () => {
      // Fill out lease fields
      // Assigned Unit number
      wrapper.find('[name="lease.unit"] select option[value="id1"]').simulate('change')
      // Lease start date
      wrapper.find('#lease_start_date_month input').simulate('change', { target: { value: '1' } })
      wrapper.find('#lease_start_date_day input').simulate('change', { target: { value: '12' } })
      wrapper.find('#lease_start_date_year input').simulate('change', { target: { value: '2019' } })

      // Preference used
      wrapper.find('[name="lease.preference_used"] select option[value="testValidPref"]').simulate('change')

      // Costs
      wrapper.find('[name="lease.total_monthly_rent_without_parking"] input').simulate('change', { target: { value: '$1' } })
      wrapper.find('[name="lease.monthly_parking_rent"] input').simulate('change', { target: { value: '$2' } })
      wrapper.find('[name="lease.monthly_tenant_contribution"] input').simulate('change', { target: { value: '$3' } })

      // Assert that they're sent to the API
      await act(async () => { wrapper.find('form').first().simulate('submit') })

      const expectedLease = {
        'id': undefined,
        'unit': 'id1',
        'lease_start_date': {'year': '2019', 'month': '1', 'day': '12'},
        'no_preference_used': false,
        'preference_used': 'testValidPref',
        'total_monthly_rent_without_parking': 1,
        'monthly_parking_rent': 2,
        'monthly_tenant_contribution': 3,
        'primary_applicant_contact': mockApplication['Applicant']['Id']
      }

      expect(mockCreateOrUpdateLease.mock.calls.length).toBe(1)
      expect(mockCreateOrUpdateLease).toHaveBeenCalledWith(expectedLease)
    })

    test('should send a null value for unit to API if selected', async () => {
      // Select the value from the dropdown
      wrapper.find('[name="lease.unit"] select option[value=""]').simulate('change')

      // Hit save
      await act(async () => { wrapper.find('form').first().simulate('submit') })

      // Verify that the API was called with null unit value
      expect(mockCreateOrUpdateLease.mock.calls.length).toBe(1)
      expect(mockCreateOrUpdateLease).toHaveBeenCalledWith(expect.objectContaining({'unit': ''}))
    })
  })

  test('should render the status update dropdown button and its menu of status options correctly', async () => {
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={supplementalApplication}
          statusHistory={statusHistory}
        />
      )
    })

    // Click on the status update dropdown button to open
    // the status options dropdown menu
    wrapper.find('.button-pager .dropdown > button').simulate('click')

    // Check that the page matches the snapshot that we have stored
    // of how the dropdown button and dropdown menu should render
    // when the dropdown menu is open
    expect(wrapper.find('.button-pager .dropdown .dropdown-menu-bottom').exists()).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })
  test('should render the status dropdown modal correctly', async () => {
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={supplementalApplication}
          statusHistory={statusHistory}
        />
      )
    })
    // Click on the status update dropdown button to open
    // the status options dropdown menu
    wrapper.find('.button-pager .dropdown > button').simulate('click')
    expect(wrapper.find('.button-pager .dropdown .dropdown-menu-bottom').exists()).toBeTruthy()

    // Select Withdrawn from the dropdown
    wrapper.find('li.dropdown-menu_item.is-withdrawn > a').simulate('click')

    // Modal opens
    expect(wrapper.find('.form-modal_form_wrapper').exists()).toBeTruthy()

    // Modal's status dropdown is the selected option
    expect(wrapper.find('.modal-inner .dropdown.status').text()).toEqual('Withdrawn')
  })
  test('should allow the status update modal to open and close', async () => {
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={supplementalApplication}
          statusHistory={statusHistory}
        />
      )
    })

    // Click on the add a comment button to open
    // the status update modal
    wrapper.find('div.status-update_footer > button').simulate('click')

    // Expect modal to be open
    expect(wrapper.find('#status-comment').exists()).toBeTruthy()

    // Click Close
    wrapper.find('div.modal-button_item.modal-button_secondary > button').simulate('click')

    // Expect modal to be closed
    expect(wrapper.find('#status-comment').exists()).toBe(false)
  })
  test('should display alert box when form is invalid on submit', async () => {
    let wrapper
    await act(async () => {
      wrapper = mount(
        <SupplementalApplicationPage
          application={supplementalApplication}
          statusHistory={statusHistory}
        />
      )
    })

    // Fill in letters in lease date month - which are invalid values
    wrapper.find('#lease_start_date_month').first().simulate('change', { target: { value: 'AB' } })
    wrapper.find('#save-supplemental-application').simulate('click')

    // alert box to display
    expect(wrapper.find('.alert-box').exists()).toBeTruthy()
  })
})
