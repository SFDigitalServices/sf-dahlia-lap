import React from 'react'
import renderer from 'react-test-renderer'
import LeaseUpSidebarButtons from 'components/molecules/LeaseUpSidebarButtons'

describe('LeaseUpSidebarButtons', () => {
  test('should render correctly with mobile styling', () => {
    const wrapper = renderer.create(
      <LeaseUpSidebarButtons
        status={'Approved'}
        withMobileStyling
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render correctly with desktop styling', () => {
    const wrapper = renderer.create(
      <LeaseUpSidebarButtons
        status={'Approved'}
        withMobileStyling={false}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render desktop styling by default', () => {
    const wrapper = renderer.create(
      <LeaseUpSidebarButtons
        status={'Approved'}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
