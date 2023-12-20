import React from 'react'

import { render } from '@testing-library/react'

import ApplicationNewPage from 'components/applications/ApplicationNewPage'

import listing from '../../fixtures/listing'

describe('ApplicationNewPage', () => {
  test('should render succesfully', () => {
    const { asFragment } = render(<ApplicationNewPage listing={listing} lendingInstitutions={{}} />)

    expect(asFragment()).toMatchSnapshot()
  })
})
