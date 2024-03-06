import React from 'react'

import { render, screen } from '@testing-library/react'

import PreferencesTable from 'components/supplemental_application/sections/PreferencesTable'
import Provider from 'context/Provider'

import application from '../../../fixtures/application'

const applicationMembers = [{ id: 'a0n0x000000AbE6AAK', first_name: 'karen', last_name: 'jones' }]
const fileBaseUrl = 'https://test.force.com'
const onSave = () => {}
const formApi = {}

describe('PreferencesTable', () => {
  test('should render a table of only preferences that the application receives (Receives_Preference = true)', () => {
    render(
      <Provider>
        <PreferencesTable
          application={application}
          applicationMembers={applicationMembers}
          onSave={onSave}
          fileBaseUrl={fileBaseUrl}
          formApi={formApi}
        />
      </Provider>
    )

    // application is receives preference == false for NRHP, and true fpr Alice Griffith
    expect(
      screen.getByRole('cell', {
        name: /alice griffith housing development resident/i
      })
    ).toBeInTheDocument()
    // There should only be one table row since NRHP doesn't apply here
    expect(screen.getAllByTestId('expandable-table-row')).toHaveLength(1)
  })
})
