import React from 'react'

import renderer from 'react-test-renderer'

import ApplicationNewPage from 'components/applications/ApplicationNewPage'

import listing from '../../fixtures/listing'

describe('ApplicationNewPage', () => {
  test('should render succesfully', () => {
    const wrapper = renderer.create(
      <ApplicationNewPage listing={listing} lendingInstitutions={{}} />
    )

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
