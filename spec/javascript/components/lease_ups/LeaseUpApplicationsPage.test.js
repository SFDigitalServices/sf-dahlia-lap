/* eslint-disable jest/no-conditional-expect */
import { act } from 'react-dom/test-utils'
import { Link } from 'react-router-dom'
import Select from 'react-select'

import Button from 'components/atoms/Button'
import PrettyTime from 'components/atoms/PrettyTime'
import TableLayout from 'components/layouts/TableLayout'
import LeaseUpApplicationsFilterContainer from 'components/lease_ups/LeaseUpApplicationsFilterContainer'
import LeaseUpApplicationsPage from 'components/lease_ups/LeaseUpApplicationsPage'
import LeaseUpApplicationsTableContainer from 'components/lease_ups/LeaseUpApplicationsTableContainer'
import Loading from 'components/molecules/Loading'
import SubstatusDropdown from 'components/molecules/SubstatusDropdown'
import FormModal from 'components/organisms/FormModal'
import StatusModalWrapper from 'components/organisms/StatusModalWrapper'

import { findWithText, mountAppWithUrl } from '../../testUtils/wrapperUtil'

const mockGetLeaseUpListing = jest.fn()
const mockFetchLeaseUpApplications = jest.fn()
const mockCreateFieldUpdateComment = jest.fn()

jest.mock('apiService', () => {
  return {
    getLeaseUpListing: async (id) => {
      mockGetLeaseUpListing(id)
      return Promise.resolve({ ...mockListing })
    },
    fetchLeaseUpApplications: async (listingId, page, filters) => {
      mockFetchLeaseUpApplications(listingId, page, filters)
      return Promise.resolve({ records: mockApplications })
    },
    createFieldUpdateComment: async (applicationId, status, comment, substatus) => {
      mockCreateFieldUpdateComment(applicationId)

      if (comment === 'FAIL_REQUEST') {
        return Promise.reject(new Error('rejected promise'))
      }

      return Promise.resolve(mockApplications)
    }
  }
})

const fillOutStatusModalAndSubmit = async (wrapper, subStatus, comment) => {
  // Change the substatus
  act(() => {
    wrapper.find(SubstatusDropdown).find(Select).props().onChange({ value: subStatus })
  })

  // Add a comment
  wrapper.find('textarea#status-comment').simulate('change', { target: { value: comment } })

  // Submit the modal
  await act(async () => {
    wrapper.find('.modal-button_primary > button').simulate('submit')
  })
  await wrapper.update()
}

const buildMockApplicationWithPreference = ({
  prefId,
  applicationId,
  prefOrder = 1,
  prefRank = 1
}) => ({
  id: prefId,
  processing_status: 'processing',
  preference_order: prefOrder,
  preference_lottery_rank: prefRank,
  record_type_for_app_preferences: 'COP',
  preference_name: 'Certificate of Preference',
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
    prefRank: '2'
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
    prefRank: '3'
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

const rowSelector = 'div.rt-tbody .rt-tr-group'

const getWrapper = async () => {
  let wrapper
  await act(async () => {
    wrapper = mountAppWithUrl(`/lease-ups/listings/${mockListing.id}`)
  })

  wrapper.update()
  return wrapper
}

describe('LeaseUpApplicationsPage', () => {
  let wrapper
  beforeEach(async () => {
    wrapper = await getWrapper()
  })

  test('should match the snapshot', async () => {
    expect(wrapper.find(LeaseUpApplicationsPage)).toMatchSnapshot()
  })

  test('renders the table', () => {
    expect(wrapper.find(LeaseUpApplicationsTableContainer)).toHaveLength(1)
  })

  test('calls get listing with the listing id', () => {
    expect(mockGetLeaseUpListing.mock.calls).toHaveLength(1)
    expect(mockGetLeaseUpListing.mock.calls[0][0]).toEqual(mockListing.id)
  })

  test('calls get applications with the listing id and page number = 0', () => {
    expect(mockFetchLeaseUpApplications.mock.calls).toHaveLength(1)
    expect(mockFetchLeaseUpApplications.mock.calls[0][0]).toEqual(mockListing.id)
    expect(mockFetchLeaseUpApplications.mock.calls[0][1]).toEqual(0)
  })

  test('it is not loading', () => {
    expect(wrapper.find(Loading).props().isLoading).toBeFalsy()
  })

  test('renders the header properly', () => {
    expect(wrapper.find(TableLayout)).toHaveLength(1)
    const headerProps = wrapper.find(TableLayout).prop('pageHeader')
    expect(headerProps.title).toEqual(mockListing.name)
    expect(headerProps.content).toEqual(mockListing.building_street_address)
    expect(headerProps.action.title).toEqual('Export')
    expect(headerProps.breadcrumbs).toHaveLength(2)
  })

  test('should render accessibility requests when present', async () => {
    expect(wrapper.find(rowSelector).first().text()).toContain('Vision')
  })

  test('should render application links as routed links', () => {
    const mockAppNames = mockApplications.map((app) => app.application.name)
    const applicationLinkWrappers = mockAppNames.map((name) => findWithText(wrapper, Link, name))

    // Just double check that our list has the same length as mockApplications, because if
    // for some reason it had length 0 the .every(..) call would always return true by default
    expect(applicationLinkWrappers).toHaveLength(6)
    expect(applicationLinkWrappers.every((w) => w.exists())).toBeTruthy()
  })

  test('status modal can be opened and closed', () => {
    expect(wrapper.find(rowSelector).first().find('button').exists()).toBeTruthy()
    act(() => {
      wrapper
        .find(rowSelector)
        .first()
        .find('Select')
        .instance()
        .props.onChange({ value: 'Appealed' })
    })
    wrapper.update()
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeTruthy()

    act(() => {
      // Click the close button
      wrapper.find('.close-reveal-modal').simulate('click')
    })

    wrapper.update()

    // Expect the modal to be closed
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeFalsy()

    // if submit wasn't clicked we shouldn't trigger an API request
    expect(mockCreateFieldUpdateComment).not.toHaveBeenCalled()
  })

  test('updates substatus and last updated date on status change', async () => {
    // Get the status last updated date before we change it, to verify that it changed.
    const dateBefore = wrapper.find(rowSelector).first().find('PrettyTime').text()

    // Change status to Appealed and open up the modal
    act(() => {
      wrapper
        .find(rowSelector)
        .first()
        .find(Select)
        .instance()
        .props.onChange({ value: 'Appealed' })
    })
    wrapper.update()

    await fillOutStatusModalAndSubmit(wrapper, 'None of the above', 'comment')

    // Expect that we submitted the comment and the modal is closed
    expect(mockCreateFieldUpdateComment).toHaveBeenCalled()
    expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeFalsy()

    // Expect the changed row to have the updated substatus and date
    expect(wrapper.find(rowSelector).first().text().includes('None of the above')).toBeTruthy()
    expect(wrapper.find(rowSelector).first().find(PrettyTime).text()).not.toEqual(dateBefore)
  })

  describe('bulk checkboxes', () => {
    const getTopLevelInputWrapper = (wrapper) => wrapper.find('input#bulk-edit-controller')

    const getRowBulkCheckboxInput = (wrapper, applicationId) =>
      wrapper.find(`input[id="bulk-action-checkbox-${applicationId}"]`)

    const getRowBulkCheckboxInputs = (wrapper) => wrapper.find('input[id^="bulk-action-checkbox-"]')

    const isChecked = (inputWrapper) => !!inputWrapper.props().checked

    describe('initial load state without boxes checked', () => {
      test('the bulk input box is unchecked and not indeterminate', () => {
        const wrapperProps = getTopLevelInputWrapper(wrapper).props()
        expect(wrapperProps.checked).toBeFalsy()
        expect(wrapperProps.className.includes('indeterminate')).toBeFalsy()
      })

      test('none of the rows have checked boxes', () => {
        expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual(Array(6).fill(false))
      })

      test('the bulk status button is disabled', () => {
        expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeTruthy()
      })
    })

    describe('when a single checkbox is clicked', () => {
      beforeEach(() => {
        act(() => {
          getRowBulkCheckboxInputs(wrapper).first().simulate('click')
        })
        wrapper.update()
      })

      test('the bulk input box is checked and indeterminate', () => {
        const wrapperProps = getTopLevelInputWrapper(wrapper).props()
        expect(wrapperProps.checked).toBeTruthy()
        expect(wrapperProps.className.includes('indeterminate')).toBeTruthy()
      })

      test('the first row has a checked box and the rest are unchecked', () => {
        const allInputs = getRowBulkCheckboxInputs(wrapper)
        expect(allInputs.first().props().checked).toBeTruthy()

        expect(allInputs.slice(1).map(isChecked)).toEqual(Array(5).fill(false))
      })

      test('the bulk status button is enabled', () => {
        expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeFalsy()
      })

      describe('when all row checkboxes with unique IDs are clicked individually', () => {
        beforeEach(() => {
          const ids = [1002, 1003, 1004, 1005]

          act(() => {
            ids.forEach((id) => getRowBulkCheckboxInput(wrapper, id).first().simulate('click'))
          })
          wrapper.update()
        })

        test('it returns to the all-boxes-checked state', () => {
          expect(getTopLevelInputWrapper(wrapper).props().checked).toBeTruthy()
          expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual(Array(6).fill(true))
          expect(
            getTopLevelInputWrapper(wrapper).props().className.includes('indeterminate')
          ).toBeFalsy()
          expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeFalsy()
        })
      })
    })

    describe('when multiple checkboxes are clicked', () => {
      beforeEach(async () => {
        act(() => {
          getRowBulkCheckboxInputs(wrapper)
            .slice(0, 2)
            .forEach((input) => input.simulate('click'))
        })
        wrapper.update()
      })

      test('the bulk input box is checked and indeterminate', () => {
        const wrapperProps = getTopLevelInputWrapper(wrapper).props()
        expect(wrapperProps.checked).toBeTruthy()
        expect(wrapperProps.className.includes('indeterminate')).toBeTruthy()
      })

      test('the first and second rows have a checked box and the rest are unchecked', () => {
        const allInputs = getRowBulkCheckboxInputs(wrapper)
        expect(allInputs.at(0).props().checked).toBeTruthy()
        expect(allInputs.at(1).props().checked).toBeTruthy()

        expect(allInputs.slice(2).map(isChecked)).toEqual(Array(4).fill(false))
      })

      test('the bulk status button is enabled', () => {
        expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeFalsy()
      })

      describe('when the set status button value changes', () => {
        beforeEach(() => {
          act(() => {
            wrapper
              .find(LeaseUpApplicationsFilterContainer)
              .find(Select)
              .instance()
              .props.onChange({ value: 'Appealed' })
          })

          wrapper.update()
        })

        test('the status modal opens', () => {
          expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeTruthy()
        })

        test('the status modal mas the correct subtitle', () => {
          expect(wrapper.find(StatusModalWrapper).find(FormModal).props().subtitle).toEqual(
            'Update the status for 2 selected items'
          )
        })

        describe('when information is submitted with a successful request', () => {
          beforeEach(async () => {
            await fillOutStatusModalAndSubmit(wrapper, 'None of the above', 'comment')
          })

          test('should uncheck the status item', () => {
            const allInputs = getRowBulkCheckboxInputs(wrapper)
            expect(isChecked(allInputs.at(0))).toBeFalsy()
            expect(isChecked(allInputs.at(1))).toBeFalsy()
          })

          test('should close the modal', () => {
            expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeFalsy()
          })
        })

        describe('when information is submitted with a failing request', () => {
          beforeEach(async () => {
            await fillOutStatusModalAndSubmit(wrapper, 'None of the above', 'FAIL_REQUEST')
          })

          test('should not uncheck the status items', () => {
            const allInputs = getRowBulkCheckboxInputs(wrapper)
            expect(isChecked(allInputs.at(0))).toBeTruthy()
            expect(isChecked(allInputs.at(1))).toBeTruthy()
          })

          test('should keep the modal open', () => {
            expect(wrapper.find(StatusModalWrapper).props().isOpen).toBeTruthy()
          })

          test('should show an alert', () => {
            expect(wrapper.find(StatusModalWrapper).props().showAlert).toBeTruthy()
            expect(wrapper.find(StatusModalWrapper).props().alertMsg).toEqual(
              'We were unable to make the update for 2 out of 2 applications, please try again.'
            )
          })
        })
      })
    })

    describe('after checking the top-level bulk checkbox', () => {
      beforeEach(() => {
        act(() => {
          getTopLevelInputWrapper(wrapper).simulate('click')
        })
        wrapper.update()
      })

      test('the bulk input box is checked', () => {
        expect(getTopLevelInputWrapper(wrapper).props().checked).toBeTruthy()
      })

      test('all of the rows have checked boxes', () => {
        expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual(Array(6).fill(true))
      })

      test('the bulk status button is enabled', () => {
        expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeFalsy()
      })

      describe('when the top-level checkbox is clicked again', () => {
        beforeEach(() => {
          act(() => {
            getTopLevelInputWrapper(wrapper).simulate('click')
          })
          wrapper.update()
        })

        test('it returns to the all boxes unchecked state', () => {
          expect(getTopLevelInputWrapper(wrapper).props().checked).toBeFalsy()
          expect(
            getTopLevelInputWrapper(wrapper).props().className.includes('indeterminate')
          ).toBeFalsy()
          expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual(Array(6).fill(false))
          expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeTruthy()
        })
      })

      describe('when the first checkbox is unchecked', () => {
        beforeEach(() => {
          act(() => {
            getRowBulkCheckboxInputs(wrapper).first().simulate('click')
          })
          wrapper.update()
        })

        test('the bulk input box is checked and indeterminate', () => {
          const wrapperProps = getTopLevelInputWrapper(wrapper).props()
          expect(wrapperProps.checked).toBeTruthy()

          expect(wrapperProps.className.includes('indeterminate')).toBeTruthy()
        })

        test('the first row checkbox is unchecked', () => {
          expect(getRowBulkCheckboxInputs(wrapper).first().props().checked).toBeFalsy()
        })

        test('the rest of the checkboxes are checked', () => {
          const allRowInputs = getRowBulkCheckboxInputs(wrapper)
          expect(allRowInputs.length > 1).toBeTruthy()

          const inputsAfterFirst = allRowInputs.slice(1)
          expect(inputsAfterFirst.map(isChecked)).toEqual(Array(5).fill(true))
        })

        test('the bulk status button is enabled', () => {
          expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeFalsy()
        })

        describe('when the first checkbox is clicked again', () => {
          beforeEach(() => {
            act(() => {
              getRowBulkCheckboxInputs(wrapper).first().simulate('click')
            })
            wrapper.update()
          })

          test('it returns to the all-boxes-checked state', () => {
            expect(getTopLevelInputWrapper(wrapper).props().checked).toBeTruthy()
            expect(
              getTopLevelInputWrapper(wrapper).props().className.includes('indeterminate')
            ).toBeFalsy()
            expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual(Array(6).fill(true))
            expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeFalsy()
          })
        })

        describe('when the top-level indeterminate checkbox is clicked', () => {
          beforeEach(() => {
            act(() => {
              getTopLevelInputWrapper(wrapper).simulate('click')
            })
            wrapper.update()
          })

          test('it returns to the all-boxes-unchecked state', () => {
            expect(getTopLevelInputWrapper(wrapper).props().checked).toBeFalsy()
            expect(
              getTopLevelInputWrapper(wrapper).props().className.includes('indeterminate')
            ).toBeFalsy()
            expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual(Array(6).fill(false))
            expect(findWithText(wrapper, Button, 'Set Status').props().disabled).toBeTruthy()
          })
        })
      })
    })

    describe('when a checkbox that applies to multiple rows is clicked', () => {
      beforeEach(() => {
        act(() => {
          getRowBulkCheckboxInputs(wrapper).last().simulate('click')
        })
        wrapper.update()
      })

      test('only the two affected rows are checked', () => {
        expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual([
          false,
          false,
          false,
          false,
          true,
          true
        ])
      })

      describe('when the same checkbox that applies to multiple rows is clicked again', () => {
        beforeEach(() => {
          act(() => {
            getRowBulkCheckboxInputs(wrapper).last().simulate('click')
          })
          wrapper.update()
        })

        test('all rows are unchecked', () => {
          expect(getRowBulkCheckboxInputs(wrapper).map(isChecked)).toEqual(Array(6).fill(false))
        })
      })
    })
  })
})
