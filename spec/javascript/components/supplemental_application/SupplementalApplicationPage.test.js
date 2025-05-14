import { render, screen, fireEvent, within, act } from '@testing-library/react'
import { useFlag as useFlagUnleash, useFlagsStatus } from '@unleash/proxy-client-react'
import { cloneDeep } from 'lodash'
import selectEvent from 'react-select-event'

import supplementalApplication from '../../fixtures/supplemental_application'
import { leaseUpAppWithUrl, renderAppWithUrl } from '../../testUtils/wrapperUtil'

const mockInitialLoad = jest.fn()
const mockSubmitApplication = jest.fn()
const mockUpdateApplication = jest.fn()
const mockUpdatePreference = jest.fn()
const mockCreateLease = jest.fn()
const mockUpdateLease = jest.fn()
const mockGetRentalAssistances = jest.fn()
window.scrollTo = jest.fn()

const getMockApplication = () => cloneDeep(supplementalApplication)

const getWindowUrl = (id) => `/lease-ups/applications/${id}`

const ID_NO_AVAILABLE_UNITS = 'idwithnoavailableunits'
const ID_WITH_TOTAL_MONTHLY_RENT = 'idwithtotalmonthlyrent'

jest.mock('@unleash/proxy-client-react')
useFlagUnleash.mockImplementation(() => false)
useFlagsStatus.mockImplementation(() => ({
  flagsError: false,
  flagsReady: true
}))

/**
 * TODO: instead of mocking apiService, we should probably be mocking one level up (actions.js).
 */
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
    getSupplementalApplication: async (applicationId) => {
      mockInitialLoad(applicationId)

      const appWithPrefs = _cloneDeep(mockedApplication)

      if (applicationId === _ID_WITH_TOTAL_MONTHLY_RENT) {
        appWithPrefs.total_monthly_rent = '50'
      }

      if (applicationId === _ID_NO_AVAILABLE_UNITS) {
        // let the listing know that it should have no available units.
        appWithPrefs.listing.id = _ID_NO_AVAILABLE_UNITS
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

      _merge(appWithPrefs.preferences[2], {
        id: 'validDTHPPref',
        post_lottery_validation: 'Confirmed',
        receives_preference: true,
        layered_validation: 'Confirmed'
      })

      return {
        application: { ...appWithPrefs, rental_assistances: null, lease: null },
        fileBaseUrl: 'fileBaseUrl'
      }
    },
    getLease: async (applicationId) => {
      const lease = _cloneDeep(mockedApplication.lease)
      if (applicationId === _ID_WITH_SELECTED_UNIT) {
        lease.unit = 'id1'
      } else {
        lease.unit = null
      }
      return { ...lease }
    },
    getStatusHistory: async (applicationId) => [],
    getUnits: async (listingId) => {
      const occupiedUnit = _merge(_cloneDeep(mockedUnits[0]), {
        id: 'idOccupied',
        unit_number: 'occupied',
        unit_type: 'studio',
        priority_type: null,
        max_ami_for_qualifying_unit: 50,
        status: 'Occupied',
        leases: [
          {
            application_id: 'testId',
            preference_used_name: '',
            lease_status: 'Signed'
          }
        ]
      })

      return listingId === _ID_NO_AVAILABLE_UNITS
        ? [occupiedUnit]
        : [
            occupiedUnit,
            _merge(mockedUnits[0], {
              id: 'unit_without_priority',
              unit_number: 'unit without priority',
              priority_type: null,
              max_ami_for_qualifying_unit: 50,
              status: 'Available'
            }),
            _merge(mockedUnits[1], {
              id: 'unit_with_priority',
              unit_number: 'unit with priority',
              priority_type: 'Hearing/Vision impairments',
              max_ami_for_qualifying_unit: 50,
              status: 'Available'
            })
          ]
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
      const assistances = _cloneDeep(mockedApplication.rental_assistances)

      mockGetRentalAssistances(applicationId)

      return assistances
    },
    createRentalAssistance: async (_) => ({}),
    updateRentalAssistance: async (_) => ({})
  }
})
const getWrapper = async (id = getMockApplication().id) => {
  return await act(async () => renderAppWithUrl(getWindowUrl(id)))
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
    jest.useFakeTimers()
    const mockDate = new Date('2024-06-01T00:00:00Z')
    jest.setSystemTime(mockDate)

    const { asFragment } = await act(() =>
      render(leaseUpAppWithUrl(getWindowUrl(getMockApplication().id)))
    )

    expect(asFragment()).toMatchSnapshot()

    jest.useRealTimers()
  })

  test('it only performs initial load request if nothing is changed', async () => {
    await getWrapper()

    await act(() => {
      fireEvent.submit(screen.getByRole('form'))
    })

    expect(mockInitialLoad.mock.calls).toHaveLength(1)
    expect(mockSubmitApplication.mock.calls).toHaveLength(1)
  })

  test('it only updates changed fields', async () => {
    const payload = getMockApplication()
    await getWrapper()

    await act(() =>
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /number of dependents/i
        }),
        { target: { value: '2' } }
      )
    )

    await act(() => {
      fireEvent.submit(screen.getByRole('form'))
    })

    expect(mockSubmitApplication.mock.calls).toHaveLength(1)
    expect(mockSubmitApplication).toHaveBeenCalledWith({
      id: payload.id,
      number_of_dependents: 2,
      has_developmental_disability: 'No',
      has_military_service: 'No',
      reserved_senior: 'No'
    })
  })

  test('it saves demographics correctly', async () => {
    const expectedDemographics = {
      number_of_dependents: 2,
      number_of_seniors: 3,
      number_of_minors: 0,
      applicant: { marital_status: 'Domestic Partner' }
    }

    await getWrapper()

    await act(() =>
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /number of dependents/i
        }),
        { target: { value: '2' } }
      )
    )

    await act(() =>
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /number of seniors/i
        }),
        { target: { value: '3' } }
      )
    )
    await act(() =>
      fireEvent.change(
        screen.getByRole('combobox', {
          name: /number of minors/i
        }),
        { target: { value: '0' } }
      )
    )
    fireEvent.change(
      screen.getByRole('combobox', {
        name: /primary applicant marital status/i
      }),
      { target: { value: 'Domestic Partner' } }
    )

    await act(() => {
      fireEvent.submit(screen.getByRole('form'))
    })

    expect(mockSubmitApplication.mock.calls).toHaveLength(1)
    expect(mockSubmitApplication.mock.calls[0][0]).toMatchObject(expectedDemographics)
  })

  describe('preference panel', () => {
    test('it saves a live/work application preference panel', async () => {
      await getWrapper()

      expect(screen.getAllByTestId('expandable-table-row')[3]).toHaveAttribute(
        'aria-expanded',
        'false'
      )
      // Click edit to open up the panel
      act(() => {
        fireEvent.click(
          within(screen.getAllByTestId('expandable-table-row')[3]).getByRole('button', {
            name: /edit/i
          })
        )
      })

      expect(screen.getAllByTestId('expandable-table-row')[3]).toHaveAttribute(
        'aria-expanded',
        'true'
      )
      // Save the preference panel without making updates
      await act(async () => {
        fireEvent.click(
          within(screen.getAllByTestId('expandable-table-row-button')[3]).getByRole('button', {
            name: /save/i
          })
        )
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
      await getWrapper(ID_WITH_TOTAL_MONTHLY_RENT)

      // Click edit to open up the panel
      act(() => {
        fireEvent.click(
          within(screen.getAllByTestId('expandable-table-row')[0]).getByRole('button', {
            name: /edit/i
          })
        )
      })
      // Save the preference panel without making updates
      await act(async () => {
        fireEvent.click(
          within(screen.getAllByTestId('expandable-table-row-button')[0]).getByRole('button', {
            name: /save/i
          })
        )
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
      await getWrapper()

      act(() => {
        fireEvent.change(
          screen.getByRole('textbox', {
            name: /confirmed total household annual income/i
          }),
          { target: { value: '1234' } }
        )
      })

      await act(async () => {
        fireEvent.submit(screen.getByRole('form'))
      })

      const expectedApplication = {
        id: application.id,
        has_developmental_disability: 'No',
        has_military_service: 'No',
        reserved_senior: 'No'
      }
      expectedApplication.confirmed_household_annual_income = '1234'

      expect(mockSubmitApplication.mock.calls).toHaveLength(1)
      expect(mockSubmitApplication).toHaveBeenCalledWith(expectedApplication)
    })

    test('converts empty values to null when touched', async () => {
      const application = getMockApplication()
      await getWrapper()

      act(() => {
        fireEvent.change(
          screen.getByRole('textbox', {
            name: /confirmed total household annual income/i
          }),
          { target: { value: '' } }
        )
      })

      // We don't expect there to be a value for confirmed_household_annual_income
      const expectedApplication = {
        id: application.id,
        has_developmental_disability: 'No',
        has_military_service: 'No',
        reserved_senior: 'No'
      }

      await act(async () => {
        fireEvent.submit(screen.getByRole('form'))
      })
      expect(mockSubmitApplication.mock.calls).toHaveLength(1)
      expect(mockSubmitApplication).toHaveBeenCalledWith(expectedApplication)
    })
  })

  describe('Lease Section', () => {
    let mockApplication
    beforeEach(async () => {
      mockApplication = getMockApplication()
    })

    test('should save a lease object', async () => {
      await getWrapper()

      fireEvent.click(screen.getByRole('button', { name: /edit lease/i }))

      const leaseStartDate = screen.getAllByTestId('multi-date-field')[1]
      const monthInput = within(leaseStartDate).getAllByRole('textbox')[0]
      const dayInput = within(leaseStartDate).getAllByRole('textbox')[1]
      const yearInput = within(leaseStartDate).getAllByRole('textbox')[2]
      expect(monthInput).toHaveAttribute('placeholder', 'MM')
      expect(dayInput).toHaveAttribute('placeholder', 'DD')
      expect(yearInput).toHaveAttribute('placeholder', 'YYYY')
      // Fill out lease fields
      // Assigned Unit number

      selectEvent.openMenu(
        within(
          screen.getByRole('button', {
            name: /assigned unit number/i
          })
        ).getByRole('combobox')
      )

      // Lease start date
      await act(() => {
        fireEvent.click(screen.getByText(/unit without priority/i))

        fireEvent.change(monthInput, {
          target: { value: '1' }
        })
        fireEvent.change(dayInput, {
          target: { value: '12' }
        })
        fireEvent.change(yearInput, {
          target: { value: '2019' }
        })

        // Preference used
        fireEvent.change(
          screen.getByRole('combobox', {
            name: /preference used/i
          }),
          { target: { value: 'validDTHPPref' } }
        )
      })

      // Costs
      // need to set this to "Yes" first to be able to access the other parking cost fields.
      await act(() => {
        fireEvent.change(
          screen.getByRole('combobox', {
            name: /bmr parking space assigned\?/i
          }),
          { target: { value: 'Yes' } }
        )
      })

      fireEvent.change(
        screen.getByRole('textbox', {
          name: /monthly rent/i
        }),
        {
          target: {
            value: '$1'
          }
        }
      )

      fireEvent.change(
        screen.getByRole('textbox', {
          name: /monthly cost/i
        }),
        { target: { value: '$2' } }
      )

      fireEvent.change(
        screen.getByRole('textbox', {
          name: /tenant contribution/i
        }),
        { target: { value: '$3' } }
      )

      // Assert that they're sent to the API
      await act(async () => {
        fireEvent.submit(screen.getByRole('form'))
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
    }, 10000)

    test('it displays "No Units Available" and 0 units count when no units available', async () => {
      await getWrapper(ID_NO_AVAILABLE_UNITS)
      const unitSelect = screen.getByRole('button', {
        name: /assigned unit number/i
      })

      expect(within(unitSelect).getByText('No Units Available')).toBeInTheDocument()
      expect(screen.getByTestId('total-available-count').textContent).toBe('0')
    })

    describe('when no unit is selected', () => {
      beforeEach(async () => {
        await getWrapper()
      })

      test('it shows expected available unit counts', () => {
        expect(screen.getByTestId('total-available-count').textContent).toBe('2')
        expect(screen.getByTestId('accessibility-available-count').textContent).toBe('1')
        expect(screen.getByTestId('dthp-available-count').textContent).toBe('3')
        expect(screen.getByTestId('nrhp-available-count').textContent).toBe('4')
      })

      test('it does not change the DTHP availability count when pref used is selected', () => {
        act(() => {
          fireEvent.change(
            screen.getByRole('combobox', {
              name: /preference used/i
            }),
            { target: { value: 'validDTHPPref' } }
          )
        })
        expect(screen.getByTestId('dthp-available-count').textContent).toBe('3')
      })
    })

    describe('when unit without priority is selected', () => {
      beforeEach(async () => {
        await getWrapper()

        fireEvent.click(screen.getByRole('button', { name: /edit lease/i }))

        selectEvent.openMenu(
          within(
            screen.getByRole('button', {
              name: /assigned unit number/i
            })
          ).getByRole('combobox')
        )

        act(() => {
          fireEvent.click(screen.getByText(/unit without priority/i))
        })
      })

      test('it decreases the number of available units', () => {
        expect(screen.getByTestId('total-available-count').textContent).toBe('1')
      })

      test('it does not impact the number of accessibility units', () => {
        expect(screen.getByTestId('accessibility-available-count').textContent).toBe('1')
      })

      test('it does not impact the number of priority set asides', () => {
        expect(screen.getByTestId('dthp-available-count').textContent).toBe('3')
        expect(screen.getByTestId('nrhp-available-count').textContent).toBe('4')
      })

      test('it decreases the available DTHP count when DTHP is pref used', () => {
        act(() => {
          fireEvent.change(
            screen.getByRole('combobox', {
              name: /preference used/i
            }),
            { target: { value: 'validDTHPPref' } }
          )
        })
        expect(screen.getByTestId('dthp-available-count').textContent).toBe('2')
      })
    })

    describe('when unit with priority is selected', () => {
      beforeEach(async () => {
        await getWrapper()

        fireEvent.click(screen.getByRole('button', { name: /edit lease/i }))

        selectEvent.openMenu(
          within(
            screen.getByRole('button', {
              name: /assigned unit number/i
            })
          ).getByRole('combobox')
        )

        await act(async () => {
          await fireEvent.click(screen.getByText(/unit with priority/i))
        })
      })

      test('it decreases the number of available units', () => {
        expect(screen.getByTestId('total-available-count').textContent).toBe('1')
      })

      test('it decreases the number of accessibility units', () => {
        expect(screen.getByTestId('accessibility-available-count').textContent).toBe('0')
      })
    })

    describe('partners.unitStatus feature toggle', () => {
      beforeEach(async () => {
        await getWrapper()
      })

      test('shows available units based on leases when toggle is off', () => {
        useFlagUnleash.mockImplementation(() => false)
        expect(screen.getByTestId('total-available-count').textContent).toBe('2')
      })

      test('shows available units based on unit status when toggle is on', () => {
        useFlagUnleash.mockImplementation(() => true)
        expect(screen.getByTestId('total-available-count').textContent).toBe('2')
      })
    })
  })

  describe('Status Sidebar', () => {
    test('should render the LeaseUpSidebar', async () => {
      await getWrapper()

      // Check that the page matches the snapshot that we have stored
      // of how the dropdown button and dropdown menu should render
      // when the dropdown menu is open
      expect(document.querySelector('.sidebar-content')).toBeInTheDocument(1)
    })
  })

  test('should display alert box when form is invalid on submit', async () => {
    await getWrapper()

    const leaseStartDate = screen.getAllByTestId('multi-date-field')[1]
    const monthInput = within(leaseStartDate).getAllByRole('textbox')[0]

    // Fill in letters in lease date month - which are invalid values

    act(() => {
      fireEvent.change(monthInput, {
        target: { value: 'AB' }
      })
    })

    fireEvent.click(screen.getAllByRole('button', { name: /save/i }).pop())
    // alert box to display
    expect(
      screen.getByText(/please resolve any errors before saving the application\./i)
    ).toBeInTheDocument()
  })
})
