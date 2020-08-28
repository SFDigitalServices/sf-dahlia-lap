import React from 'react'
import { shallow } from 'enzyme'
import LeaseUpSidebarButtons from 'components/molecules/LeaseUpSidebarButtons'

describe('LeaseUpSidebarButtons', () => {
  test('should render correctly with mobile styling', () => {
    const wrapper = shallow(
      <LeaseUpSidebarButtons
        status={'Approved'}
        withMobileStyling
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render correctly with desktop styling', () => {
    const wrapper = shallow(
      <LeaseUpSidebarButtons
        status={'Approved'}
        withMobileStyling={false}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })

  test('should render desktop styling by default', () => {
    const wrapper = shallow(
      <LeaseUpSidebarButtons
        status={'Approved'}
      />
    )
    expect(wrapper).toMatchSnapshot()
  })
})
