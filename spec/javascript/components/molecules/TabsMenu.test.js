import React from 'react'

import { shallow } from 'enzyme'
import { Link } from 'react-router-dom'

import TabsMenu, { Tab } from 'components/molecules/TabsMenu'

const mockTabItem = ({ title, url, active, onClick, renderAsRouterLink }) => ({
  title,
  url,
  active,
  renderAsRouterLink,
  onClick
})

const mockOnClick = jest.fn()

const ITEM_BASIC = mockTabItem({ title: 'itemBasic', url: '/itemBasic' })
const ITEM_ACTIVE = mockTabItem({ title: 'itemActive', url: '/itemActive', active: true })
const ITEM_ROUTED = mockTabItem({
  title: 'itemRouted',
  url: '/itemRouted',
  renderAsRouterLink: true
})
const ITEM_ONCLICK = mockTabItem({
  title: 'itemOnClick',
  onClick: mockOnClick
})

describe('TabsMenu', () => {
  describe('with a single active tab', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<TabsMenu items={[ITEM_ACTIVE]} />)
    })

    test('should render one tab with the correct props', () => {
      expect(wrapper.find(Tab)).toHaveLength(1)
      expect(wrapper.find(Tab).props().tabItem).toEqual(ITEM_ACTIVE)
    })
  })

  describe('with multiple tabs', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<TabsMenu items={[ITEM_BASIC, ITEM_ACTIVE, ITEM_ROUTED]} />)
    })

    test('should render each tab with the correct props', () => {
      expect(wrapper.find(Tab)).toHaveLength(3)
      expect(wrapper.find(Tab).map((tabWrapper) => tabWrapper.props().tabItem)).toEqual([
        ITEM_BASIC,
        ITEM_ACTIVE,
        ITEM_ROUTED
      ])
    })
  })
})

describe('Tab', () => {
  describe('when active', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Tab tabItem={ITEM_ACTIVE} />)
    })

    test('renders an <a /> link', () => {
      const linkWrapper = wrapper.find('a')
      expect(linkWrapper.props().href).toEqual(ITEM_ACTIVE.url)
      expect(linkWrapper.text()).toEqual(ITEM_ACTIVE.title)
    })

    test('does not trigger onClick', () => {
      wrapper.find('a').simulate('click')
      expect(mockOnClick.mock.calls).toHaveLength(0)
    })

    test('renders the list item with the active class', () => {
      expect(wrapper.find('li').hasClass('active')).toBeTruthy()
    })
  })

  describe('when linking to a single page app url', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Tab tabItem={ITEM_ROUTED} />)
    })

    test('renders a react router <Link />', () => {
      const linkWrapper = wrapper.find(Link)
      expect(linkWrapper).toHaveLength(1)
      expect(linkWrapper.props().to).toEqual(ITEM_ROUTED.url)
      expect(linkWrapper.text()).toEqual(ITEM_ROUTED.title)
    })

    test('does not trigger onClick', () => {
      wrapper.find(Link).simulate('click')
      expect(mockOnClick.mock.calls).toHaveLength(0)
    })
  })

  describe('when onClick specified', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Tab tabItem={ITEM_ONCLICK} />)
    })

    test('renders a button', () => {
      const buttonWrapper = wrapper.find('button')
      expect(buttonWrapper.props().type).toEqual('button')
      expect(buttonWrapper.text()).toEqual(ITEM_ONCLICK.title)
    })

    test('triggers onClick properly', () => {
      wrapper.find('button').simulate('click')
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })

    describe('when a url is specified', () => {
      let wrapper
      beforeEach(() => {
        wrapper = shallow(<Tab tabItem={{ ...ITEM_ONCLICK, url: '/testUrl' }} />)
      })

      test('still renders a button', () => {
        const buttonWrapper = wrapper.find('button')
        expect(buttonWrapper.props().type).toEqual('button')
        expect(buttonWrapper.text()).toEqual(ITEM_ONCLICK.title)
      })

      test('triggers onClick properly', () => {
        wrapper.find('button').simulate('click')
        expect(mockOnClick.mock.calls).toHaveLength(1)
      })
    })
  })
})
