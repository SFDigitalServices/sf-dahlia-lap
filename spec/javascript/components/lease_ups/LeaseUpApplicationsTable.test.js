import React from 'react'

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import LeaseUpApplicationsTable from 'components/lease_ups/LeaseUpApplicationsTable'
import Provider from 'context/Provider'
import * as customHooks from 'utils/customHooks'

import {
  mockBulkCheckboxesState,
  mockDataSet,
  mockPrefMap
} from '../../fixtures/lease_up_applications'

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
          />
        </Provider>
      </BrowserRouter>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
