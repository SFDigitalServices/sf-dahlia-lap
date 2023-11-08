import React from 'react'

import { render } from '@testing-library/react'
import { Form } from 'react-final-form'

import RentBurdenedPanel from 'components/supplemental_application/sections/preferences/RentBurdenedPanel'

describe('RentBurdenedPanel', () => {
  const onSubmitMock = (values) => {}

  test('should render successfully', () => {
    const { asFragment } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <RentBurdenedPanel preferenceIndex='1' />
          </form>
        )}
      </Form>
    )

    expect(asFragment()).toMatchSnapshot()
  })
})
