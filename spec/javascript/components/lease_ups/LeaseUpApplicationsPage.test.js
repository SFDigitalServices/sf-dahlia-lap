/* eslint-disable jest/no-disabled-tests */
/* eslint-disable jest/no-conditional-expect */
import React from 'react'

import { cleanup, within, screen, fireEvent, act, waitFor } from '@testing-library/react'
import { useFlag as useFlagUnleash, useFlagsStatus, useVariant } from '@unleash/proxy-client-react'

import { renderAppWithUrl } from '../../testUtils/wrapperUtil'

jest.mock('@unleash/proxy-client-react')

useFlagUnleash.mockImplementation(() => true)
useFlagsStatus.mockImplementation(() => ({
  flagsError: false,
  flagsReady: true
}))
useVariant.mockImplementation(() => ({
  payload: {
    value: 'listingId'
  }
}))

const mockGetLeaseUpListing = jest.fn()
const mockFetchLeaseUpApplicationsPagination = jest.fn()
const mockCreateFieldUpdateComment = jest.fn()
const mockUpdateListing = jest.fn()
const mockUpdateApplication = jest.fn()
const mockSendInviteToApply = jest.fn()

jest.mock('apiService', () => {
  return {
    getLeaseUpListing: async (id) => {
      mockGetLeaseUpListing(id)
      return Promise.resolve({ ...mockListing })
    },
    fetchLeaseUpApplicationsPagination: async (listingId, page, filters) => {
      mockFetchLeaseUpApplicationsPagination(listingId, page, filters)
      return Promise.resolve({ records: mockApplications })
    },
    createFieldUpdateComment: async (applicationId, status, comment, substatus) => {
      mockCreateFieldUpdateComment(applicationId)

      if (comment === 'FAIL_REQUEST') {
        return Promise.reject(new Error('rejected promise'))
      }

      return Promise.resolve(mockApplications)
    },
    updateApplication: async (application) => {
      mockUpdateApplication(application)
      return Promise.resolve(true)
    },
    updateListing: async (listing) => {
      mockUpdateListing(listing)
      return Promise.resolve(true)
    },
    sendInviteToApply: async (listing, appIds, deadline, exampleEmail) => {
      mockSendInviteToApply(listing, appIds, deadline, exampleEmail)
      return Promise.resolve(true)
    }
  }
})

jest.mock('react-select', () => (props) => {
  const handleChange = (event) => {
    const option = props.options.find((option) => option.value === event.currentTarget.value)
    props.onChange(option)
  }
  return (
    <select
      data-testid={props['data-testid'] || 'select'}
      value={props.value}
      onChange={handleChange}
      multiple={props.isMulti}
      data-disabled={props.isDisabled}
      className={props.className}
    >
      {props.options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
})

// TODO: This test should be migrated to an E2E test
const fillOutStatusModalAndSubmit = async (subStatus, comment) => {
  const modal = screen.getAllByRole('dialog')[1]

  // Change the substatus
  act(() => {
    fireEvent.change(
      within(modal).getByDisplayValue(/pending documentation from applicant to support request/i),
      {
        target: { value: subStatus }
      }
    )
  })

  // Add a comment
  fireEvent.change(
    within(modal).getByRole('textbox', {
      name: /comment \(required\)/i
    }),
    { target: { value: comment } }
  )

  // wrapper.find('textarea#status-comment').simulate('change', { target: { value: comment } })

  // Submit the modal
  await act(async () => {
    fireEvent.click(
      within(modal).getByRole('button', {
        name: /update/i
      })
    )
  })
  // await wrapper.update()
}

const buildMockApplicationWithPreference = ({
  prefId,
  applicationId,
  prefOrder = 1,
  prefRank = 1,
  customPreferenceType
}) => ({
  id: prefId,
  processing_status: 'processing',
  preference_order: prefOrder,
  preference_lottery_rank: prefRank,
  record_type_for_app_preferences: 'COP',
  preference_name: 'Certificate of Preference',
  custom_preference_type: (() => {
    if (customPreferenceType) return `${customPreferenceType}`
  })(),
  application: {
    id: applicationId,
    name: `Application Name ${applicationId}`,
    status_last_updated: '2018-04-26T12:31:39.000+0000',
    has_ada_priorities_selected: { vision_impairments: true },
    applicant: {
      id: '1',
      residence_address: `1316 BURNETT ${prefId}`,
      first_name: `some first name ${prefId}`,
      last_name: `some last name ${prefId}`,
      phone: 'some phone',
      email: `some email ${prefId}`
    }
  }
})

const mockListing = {
  id: 'listingId',
  name: 'listingName',
  building_street_address: 'buildingAddress',
  report_id: 'REPORT_ID'
}

const mockApplications = [
  buildMockApplicationWithPreference({
    prefId: '1',
    applicationId: '1001',
    prefOrder: '1',
    prefRank: '2',
    customPreferenceType: 'V-COP'
  }),
  buildMockApplicationWithPreference({
    prefId: '2',
    applicationId: '1002',
    prefOrder: '2',
    prefRank: '1'
  }),
  buildMockApplicationWithPreference({
    prefId: '3',
    applicationId: '1003',
    prefOrder: '2',
    prefRank: '3',
    customPreferenceType: 'V-COP'
  }),
  buildMockApplicationWithPreference({
    prefId: '4',
    applicationId: '1004',
    prefOrder: '3',
    prefRank: '2'
  }),

  // these last two rows should have the same application IDs
  buildMockApplicationWithPreference({
    prefId: '5',
    applicationId: '1005'
  }),
  buildMockApplicationWithPreference({
    prefId: '6',
    applicationId: '1005'
  })
]

const getWrapper = async (searchParameters = '') => {
  let wrapper
  await act(async () => {
    wrapper = renderAppWithUrl(`/lease-ups/listings/${mockListing.id}?${searchParameters}`)
  })

  return wrapper
}

describe('LeaseUpApplicationsPage', () => {
  let rtlWrapper
  beforeEach(async () => {
    rtlWrapper = await getWrapper()
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  test('should match the snapshot', async () => {
    expect(rtlWrapper.asFragment()).toMatchSnapshot()
  })

  test('calls get listing with the listing id', () => {
    expect(mockGetLeaseUpListing.mock.calls).toHaveLength(1)
    expect(mockGetLeaseUpListing.mock.calls[0][0]).toEqual(mockListing.id)
  })

  test('calls get applications with the listing id and page number = 0', () => {
    expect(mockFetchLeaseUpApplicationsPagination.mock.calls).toHaveLength(1)
    expect(mockFetchLeaseUpApplicationsPagination.mock.calls[0][0]).toEqual(mockListing.id)
    expect(mockFetchLeaseUpApplicationsPagination.mock.calls[0][1]).toBe(0)
  })

  test('it is not loading', () => {
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
  })

  test('renders the header properly', () => {
    expect(screen.getByRole('heading', { name: mockListing.name })).toBeInTheDocument()
    expect(screen.getByText(mockListing.building_street_address)).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: /export/i
      })
    ).toBeInTheDocument()
    expect(within(screen.queryByLabelText('breadcrumb')).getAllByRole('listitem')).toHaveLength(2)
  })

  test('should render accessibility requests when present', async () => {
    expect(
      screen.getByRole('row', {
        name: /cop 2 application name 1001 some first name 1 some last name 1 vision 04\/26\/2018 processing/i
      })
    ).toBeInTheDocument()
  })

  test('should render application links as routed links', () => {
    const applicationLinkWrappers = screen.getAllByRole('link', {
      name: /application name/i
    })

    // Just double check that our list has the same length as mockApplications
    expect(applicationLinkWrappers).toHaveLength(mockApplications.length)
  })

  test('status modal can be opened and closed', () => {
    const firstRow = screen.getByRole('row', {
      name: /cop 2 application name 1001 some first name 1 some last name 1 vision 04\/26\/2018 processing/i
    })
    expect(within(firstRow).getByRole('button')).toBeInTheDocument()

    act(() => {
      fireEvent.change(within(firstRow).getByRole('combobox'), { target: { value: 'Appealed' } })
    })

    // React Modal nests two dialog roles, so we need to get the second one
    expect(screen.getAllByRole('dialog')[1]).toBeInTheDocument()

    act(() => {
      fireEvent.click(
        screen.getByRole('button', {
          name: /close modal/i
        })
      )
    })

    // Expect the modal to be closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // if submit wasn't clicked we shouldn't trigger an API request
    expect(mockCreateFieldUpdateComment).not.toHaveBeenCalled()
  })

  test('updates substatus and last updated date on status change', async () => {
    // Get the status last updated date before we change it, to verify that it changed.
    const firstRow = screen.getByRole('row', {
      name: /cop 2 application name 1001 some first name 1 some last name 1 vision 04\/26\/2018 processing/i
    })

    // Change status to Appealed and open up the modal
    act(() => {
      fireEvent.change(within(firstRow).getByRole('combobox'), { target: { value: 'Appealed' } })
    })

    await fillOutStatusModalAndSubmit('None of the above', 'comment')

    // Expect that we submitted the comment and the modal is closed
    expect(mockCreateFieldUpdateComment).toHaveBeenCalled()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    // Expect the changed row to have the updated substatus and date
    expect(within(firstRow).getByText('None of the above')).toBeInTheDocument()
    expect(within(firstRow).queryByText(/04\/26\/2018/i)).not.toBeInTheDocument()
  })

  describe('bulk checkboxes', () => {
    const getBulkEditCheckbox = () => {
      const checkbox = screen.getAllByRole('checkbox')[0]
      expect(checkbox).toHaveAttribute('id', 'bulk-edit-controller')
      return checkbox
    }

    const getRowBulkCheckboxInput = (applicationId) =>
      screen
        .queryAllByRole('checkbox')
        .filter((checkbox) => checkbox.id.includes(`bulk-action-checkbox-${applicationId}`))
        .shift()

    const getRowBulkCheckboxInputs = () =>
      screen
        .queryAllByRole('checkbox')
        .filter((checkbox) => checkbox.id.includes('bulk-action-checkbox-'))

    let leaseUpApplicationsFilterContainer

    beforeEach(() => {
      leaseUpApplicationsFilterContainer = screen.getByTestId(
        'lease-up-applications-filter-container'
      )
    })

    describe('initial load state without boxes checked', () => {
      test('the bulk input box is unchecked and not indeterminate', () => {
        const checkbox = getBulkEditCheckbox()
        expect(checkbox).not.toBeChecked()
        expect(checkbox).not.toHaveClass('indeterminate')
      })

      test('none of the rows have checked boxes', () => {
        getRowBulkCheckboxInputs().forEach((checkbox) => {
          expect(checkbox).not.toBeChecked()
        })
      })

      test('the bulk status button is disabled', () => {
        expect(
          within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
        ).toHaveAttribute('data-disabled', 'true')
      })
    })

    describe('when a single checkbox is clicked', () => {
      beforeEach(() => {
        act(() => {
          fireEvent.click(getRowBulkCheckboxInputs()[0])
        })
      })

      test('the bulk input box is checked and indeterminate', () => {
        const checkbox = getBulkEditCheckbox()
        expect(checkbox).toBeChecked()
        expect(checkbox).toHaveClass('indeterminate')
      })

      test('the first row has a checked box and the rest are unchecked', () => {
        const allChecks = getRowBulkCheckboxInputs(rtlWrapper)
        expect(allChecks.shift()).toBeChecked()

        allChecks.forEach((checkbox) => {
          expect(checkbox).not.toBeChecked()
        })
      })

      test('the bulk status button is enabled', () => {
        // Ensure the bulk set status button is enabled
        expect(screen.getAllByRole('combobox')[0]).toBeEnabled()
      })

      test('the invite to apply email is enabled', () => {
        expect(screen.getAllByRole('combobox')[1]).toBeEnabled()
      })

      describe('when all row checkboxes with unique IDs are clicked individually', () => {
        beforeEach(() => {
          const ids = [1002, 1003, 1004, 1005]

          act(() => {
            ids.forEach((id) => {
              fireEvent.click(getRowBulkCheckboxInput(id)) // There should only be one
            })
          })
        })

        test('it returns to the all-boxes-checked state', () => {
          expect(getBulkEditCheckbox()).toBeChecked()
          getRowBulkCheckboxInputs().forEach((checkbox) => {
            expect(checkbox).toBeChecked()
          })

          expect(getBulkEditCheckbox(rtlWrapper)).not.toHaveClass('indeterminate')
          // Since we are now mocking react-select, this is no longer true in the tests.
          expect(
            within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
          ).toHaveAttribute('data-disabled', 'false')
        })
      })
    })

    describe('when multiple checkboxes are clicked', () => {
      beforeEach(async () => {
        // Previously to migrating to RTL, we were clicking the first two checkboxes
        // Due to an issue with event bubbling + RTL + React-Table, the second checkmark was not receiving the click event
        // The best solution will be to migrate this test to an E2E test
        const checks = getRowBulkCheckboxInputs()
        fireEvent.click(checks[0])
      })

      test('the bulk input box is checked and indeterminate', () => {
        const bulkCheck = getBulkEditCheckbox()
        expect(bulkCheck).toBeChecked()
        expect(bulkCheck).toHaveClass('indeterminate')
      })

      test('the first row has a checked box and the rest are unchecked', async () => {
        const allChecks = getRowBulkCheckboxInputs()

        await waitFor(() => {
          expect(allChecks[0]).toBeChecked()
        })

        allChecks.slice(1).forEach((checkbox) => {
          expect(checkbox).not.toBeChecked()
        })
      })

      test('the bulk status button is enabled', () => {
        // Since we are mocking react-select, we have to check this mock attribute
        // The first combobox is the bulk status button
        expect(
          within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
        ).toHaveAttribute('data-disabled', 'false')
      })

      describe('when the set status button value changes', () => {
        beforeEach(() => {
          act(() => {
            fireEvent.change(
              within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0],
              {
                target: { value: 'Appealed' }
              }
            )
          })
        })

        test('the status modal opens', () => {
          // The dialog component used has two nested components with role "dialog", either will work, but we will pick the first
          expect(screen.getAllByRole('dialog')[0]).toBeInTheDocument()
        })

        test('the status modal mas the correct subtitle', () => {
          const modal = screen.getAllByRole('dialog')[0]
          expect(
            within(modal).getByText('Update the status for 1 selected item')
          ).toBeInTheDocument()
        })

        describe('when information is submitted with a successful request', () => {
          beforeEach(async () => {
            await fillOutStatusModalAndSubmit('None of the above', 'comment')
          })

          test('should uncheck the status item', () => {
            const allInputs = getRowBulkCheckboxInputs()
            expect(allInputs[0]).not.toBeChecked()
          })

          test('should close the modal', () => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
          })
        })

        describe('when information is submitted with a failing request', () => {
          beforeEach(async () => {
            await fillOutStatusModalAndSubmit('None of the above', 'FAIL_REQUEST')
          })

          test('should not uncheck the status items', () => {
            const allInputs = getRowBulkCheckboxInputs(rtlWrapper)
            expect(allInputs[0]).toBeChecked()
          })

          test('should keep the modal open', () => {
            expect(screen.queryAllByRole('dialog')[0]).toBeInTheDocument()
          })

          test('should show an alert', () => {
            expect(
              screen.getByText(
                'We were unable to make the update for 1 out of 1 applications, please try again.'
              )
            ).toBeInTheDocument()
          })
        })
      })
    })

    describe('after checking the top-level bulk checkbox', () => {
      beforeEach(() => {
        act(() => {
          fireEvent.click(getBulkEditCheckbox())
        })
      })

      test('the bulk input box is checked', () => {
        expect(getBulkEditCheckbox()).toBeChecked()
      })

      test('all of the rows have checked boxes', () => {
        getRowBulkCheckboxInputs().forEach((checkbox) => {
          expect(checkbox).toBeChecked()
        })
      })

      test('the bulk status button is enabled', () => {
        expect(
          within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
        ).toHaveAttribute('data-disabled', 'false')
      })

      describe('when the top-level checkbox is clicked again', () => {
        beforeEach(() => {
          act(() => {
            fireEvent.click(getBulkEditCheckbox())
          })
        })

        test('it returns to the all boxes unchecked state', () => {
          expect(getBulkEditCheckbox()).not.toBeChecked()
          expect(getBulkEditCheckbox()).not.toHaveClass('indeterminate')

          getRowBulkCheckboxInputs().forEach((checkbox) => {
            expect(checkbox).not.toBeChecked()
          })

          expect(
            within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
          ).toHaveAttribute('data-disabled', 'true')
        })
      })

      describe('when the first checkbox is unchecked', () => {
        beforeEach(() => {
          act(() => {
            fireEvent.click(getRowBulkCheckboxInputs()[0])
          })
        })

        test('the bulk input box is checked and indeterminate', () => {
          expect(getBulkEditCheckbox()).toBeChecked()

          expect(getBulkEditCheckbox()).toHaveClass('indeterminate')
        })

        test('the first row checkbox is unchecked', () => {
          expect(getRowBulkCheckboxInputs()[0]).not.toBeChecked()
        })

        test('the rest of the checkboxes are checked', () => {
          const allRowInputs = getRowBulkCheckboxInputs()

          allRowInputs.slice(1).forEach((checkbox) => {
            expect(checkbox).toBeChecked()
          })
        })

        test('the bulk status button is enabled', () => {
          expect(
            within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
          ).toHaveAttribute('data-disabled', 'false')
        })

        describe('when the first checkbox is clicked again', () => {
          beforeEach(() => {
            act(() => {
              fireEvent.click(getRowBulkCheckboxInputs()[0])
            })
          })

          test('it returns to the all-boxes-checked state', () => {
            expect(getBulkEditCheckbox()).toBeChecked()
            expect(getBulkEditCheckbox()).not.toHaveClass('indeterminate')
            getRowBulkCheckboxInputs().forEach((checkbox) => {
              expect(checkbox).toBeChecked()
            })
            expect(
              within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
            ).toHaveAttribute('data-disabled', 'false')
          })
        })

        describe('when the top-level indeterminate checkbox is clicked', () => {
          beforeEach(() => {
            act(() => {
              fireEvent.click(getBulkEditCheckbox())
            })
          })

          test('it returns to the all-boxes-unchecked state', () => {
            expect(getBulkEditCheckbox()).not.toBeChecked()
            expect(getBulkEditCheckbox()).not.toHaveClass('indeterminate')

            getRowBulkCheckboxInputs().forEach((checkbox) => {
              expect(checkbox).not.toBeChecked()
            })

            expect(
              within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[0]
            ).toHaveAttribute('data-disabled', 'true')
          })
        })
      })
    })

    describe('when a checkbox that applies to multiple rows is clicked', () => {
      beforeEach(() => {
        act(() => {
          fireEvent.click(getRowBulkCheckboxInputs().pop())
        })
      })

      test('only the two affected rows are checked', () => {
        const expectation = [false, false, false, false, true, true]
        getRowBulkCheckboxInputs().forEach((checkbox, idx) => {
          expect(checkbox).toHaveProperty('checked', expectation[idx])
        })
      })

      describe('when the same checkbox that applies to multiple rows is clicked again', () => {
        beforeEach(() => {
          act(() => {
            fireEvent.click(getRowBulkCheckboxInputs().pop())
          })
        })

        test('all rows are unchecked', () => {
          getRowBulkCheckboxInputs().forEach((checkbox, idx) => {
            expect(checkbox).not.toBeChecked()
          })
        })
      })
    })

    describe('when using invite to apply', () => {
      beforeEach(() => {
        useFlagUnleash.mockImplementation(() => true)
        useVariant.mockImplementation(() => ({
          payload: {
            value: 'listingId'
          }
        }))
        act(() => {
          fireEvent.click(getRowBulkCheckboxInputs()[0])
        })
      })

      describe('when setting up invite to apply', () => {
        beforeEach(() => {
          act(() => {
            fireEvent.change(
              within(leaseUpApplicationsFilterContainer).getAllByRole('combobox')[1],
              {
                target: { value: 'Set up Invitation to Apply' }
              }
            )
          })
        })

        test('the document upload url should open', () => {
          expect(screen.getByText('Add document upload URL')).toBeInTheDocument()
        })

        test('the modal should close', () => {
          act(() => {
            fireEvent.click(screen.getByText('Close'))
          })
          expect(screen.queryByText('Add document upload URL')).not.toBeInTheDocument()
        })

        test('the flow', () => {
          // invalid document upload url
          const documentUrlField = screen.getByLabelText('Document upload URL')
          act(() => {
            fireEvent.change(documentUrlField, {
              target: { value: 'hello world!' }
            })
            fireEvent.blur(documentUrlField)
          })
          expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument()

          // valid document upload url
          act(() => {
            fireEvent.change(documentUrlField, {
              target: { value: 'https://sf.gov' }
            })
            fireEvent.blur(documentUrlField)
          })
          expect(screen.queryByText('Please enter a valid URL')).not.toBeInTheDocument()

          // open document submission deadline
          act(() => {
            fireEvent.click(screen.getByText('next'))
          })
          expect(screen.getByText('Set document submission deadline')).toBeInTheDocument()

          // invalid submission deadline date
          const documentUrlFieldMonth = screen.getByPlaceholderText('MM')
          const documentUrlFieldDay = screen.getByPlaceholderText('DD')
          const documentUrlFieldYear = screen.getByPlaceholderText('YYYY')
          act(() => {
            fireEvent.change(documentUrlFieldMonth, {
              target: { value: '1' }
            })
            fireEvent.change(documentUrlFieldDay, {
              target: { value: '1' }
            })
            fireEvent.change(documentUrlFieldYear, {
              target: { value: '2000' }
            })
            fireEvent.blur(documentUrlFieldMonth)
            fireEvent.blur(documentUrlFieldDay)
            fireEvent.blur(documentUrlFieldYear)
          })
          expect(documentUrlFieldMonth).toHaveClass('error')
          expect(documentUrlFieldDay).toHaveClass('error')
          expect(documentUrlFieldYear).toHaveClass('error')

          // valid submission deadline date
          act(() => {
            fireEvent.change(documentUrlFieldYear, {
              target: { value: '3000' }
            })
            fireEvent.blur(documentUrlFieldMonth)
            fireEvent.blur(documentUrlFieldDay)
            fireEvent.blur(documentUrlFieldYear)
          })
          expect(documentUrlFieldMonth).not.toHaveClass('error')
          expect(documentUrlFieldDay).not.toHaveClass('error')
          expect(documentUrlFieldYear).not.toHaveClass('error')

          // save invite to apply input
          act(() => {
            fireEvent.click(screen.getByText('save'))
          })
          expect(mockUpdateApplication.mock.calls).toHaveLength(1)
          expect(mockUpdateListing.mock.calls).toHaveLength(1)
          expect(screen.getByText('Review and send')).toBeInTheDocument()

          // open send example modal
          act(() => {
            fireEvent.click(screen.getByText('send yourself an example email'))
          })
          expect(screen.getByText('See an example')).toBeInTheDocument()

          // invalid email
          const emailField = screen.getByLabelText('Email address')
          act(() => {
            fireEvent.change(emailField, {
              target: { value: 'hello world!' }
            })
            fireEvent.blur(emailField)
          })
          expect(screen.getByText('Enter email address like: example@web.com')).toBeInTheDocument()

          // valid email
          act(() => {
            fireEvent.change(emailField, {
              target: { value: 'test@test.com' }
            })
            fireEvent.blur(emailField)
          })
          expect(
            screen.queryByText('Enter email address like: example@web.com')
          ).not.toBeInTheDocument()

          // send example email
          act(() => {
            fireEvent.click(screen.getByText('send example email'))
          })
          expect(mockSendInviteToApply.mock.calls).toHaveLength(1)

          // close send example modal
          act(() => {
            fireEvent.click(screen.getByText('cancel'))
          })
          expect(screen.queryByText('See an example')).not.toBeInTheDocument()
          expect(screen.getByText('Review and send')).toBeInTheDocument()
        })
      })
    })
  })

  describe('url search parameters', () => {
    test('should pull filters from the URL', async () => {
      await act(() =>
        getWrapper(
          'status=Approved&search=Andrew&preference=Displaced+Tenant+Housing+Preference+%28DTHP%29&total_household_size=3&accessibility=Vision+impairments%2C+Hearing+impairments'
        )
      )

      expect(screen.getByDisplayValue(/andrew/i)).toBeInTheDocument()
      expect(screen.getByText('Vision/Hearing')).toBeInTheDocument()
    })
  })
})
