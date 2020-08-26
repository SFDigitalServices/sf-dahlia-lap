import React from 'react'
import renderer from 'react-test-renderer'
import { mockStatusItem, mockStatusItems } from '../../mocks/statusItemMock'
import StatusItems from 'components/molecules/StatusItems'

const getWrapper = (items) => renderer.create(<StatusItems statusItems={items} />)

describe('StatusItems', () => {
  test('should render empty status items correctly', () => {
    const wrapper = getWrapper([])
    expect(wrapper).toMatchSnapshot()
  })

  test('should render a single status item correctly', () => {
    const wrapper = getWrapper([mockStatusItem()])
    expect(wrapper).toMatchSnapshot()
  })

  test('should render multiple status items correctly', () => {
    const wrapper = getWrapper(mockStatusItems())
    expect(wrapper).toMatchSnapshot()
  })
})
