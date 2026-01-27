import React from 'react'

import { render } from '@testing-library/react'
import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react'
import { BrowserRouter } from 'react-router-dom'

import LeaseUpApplicationsTable from 'components/lease_ups/LeaseUpApplicationsTable'
import Provider from 'context/Provider'
import * as customHooks from 'utils/customHooks'
import { LEASE_UP_STATUS_OPTIONS } from 'utils/statusUtils'

import {
  mockBulkCheckboxesState,
  mockDataSet,
  mockPrefMap
} from '../../fixtures/lease_up_applications'

jest.mock('@unleash/proxy-client-react')

describe('LeaseUpApplicationsTable', () => {
  let spy

  beforeEach(() => {
    spy = jest.spyOn(customHooks, 'useAppContext')
    spy.mockImplementation(() => [
      {
        applicationsListData: { appliedFilters: {} }
      }
    ])
  })

  afterEach(() => {
    spy.mockRestore()
  })

  test('should render succesfully when not loading', () => {
    useFlag.mockImplementation(() => true)
    useFlagsStatus.mockImplementation(() => ({
      flagsError: false
    }))
    const { asFragment } = render(
      <BrowserRouter>
        <Provider value={{ applicationsListData: {} }}>
          <LeaseUpApplicationsTable
            prefMap={mockPrefMap}
            dataSet={mockDataSet}
            listingId='a0W4U00000Hm6qRUAR'
            onLeaseUpStatusChange={jest.fn()}
            pages={10}
            rowsPerPage={10}
            atMaxPages={false}
            bulkCheckboxesState={mockBulkCheckboxesState}
            onBulkCheckboxClick={jest.fn()}
            statusOptions={LEASE_UP_STATUS_OPTIONS}
          />
        </Provider>
      </BrowserRouter>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
