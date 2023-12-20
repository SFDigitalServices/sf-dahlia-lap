import React from 'react'

import { render } from '@testing-library/react'

import StatusPill from 'components/atoms/StatusPill'

describe('StatusPill', () => {
  test.each(['Approved', 'Withdrawn', 'Processing', 'Appealed', 'Disqualified', 'Lease Signed'])(
    `should render properly with %s status`,
    (status) => {
      const { asFragment } = render(<StatusPill status={status} />)
      expect(asFragment()).toMatchSnapshot()
    }
  )
})
