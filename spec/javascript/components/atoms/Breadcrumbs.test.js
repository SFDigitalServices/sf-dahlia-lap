import React from 'react'

import { shallow } from 'enzyme'
import { uniq } from 'lodash'
import { NavLink } from 'react-router-dom'

import BreadCrumbs, { Item } from 'components/atoms/BreadCrumbs'

import { findWithProps } from '../../testUtils/wrapperUtil'

const mockCrumb = (title, link, renderAsRouterLink = undefined) => ({
  title,
  link,
  renderAsRouterLink
})

const CRUMB_A = mockCrumb('A', '/a')
const CRUMB_B = mockCrumb('B', '/b')
const CRUMB_C = mockCrumb('C', '/c')
const CRUMB_D = mockCrumb('D', '/d')
const CRUMB_ROUTED = mockCrumb('E', '/routed_link', true)
const EMPTY_CRUMB = mockCrumb('', '#')

describe('BreadCrumbs', () => {
  describe('with zero breadcrumbs', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallow(<BreadCrumbs items={[]} />)
    })

    test('renders no items', () => {
      expect(wrapper.find(Item)).toHaveLength(0)
    })
  })

  describe('with only one non-empty breadcrumb', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallow(<BreadCrumbs items={[CRUMB_A]} />)
    })

    test('renders one item', () => {
      expect(wrapper.find(Item)).toHaveLength(1)
      expect(wrapper.find(Item).props().item).toEqual(CRUMB_A)
    })

    test('renders the item as current', () => {
      expect(wrapper.find(Item).props().current).toBeTruthy()
    })
  })

  describe('with one empty breadcrumb', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallow(<BreadCrumbs items={[EMPTY_CRUMB]} />)
    })

    test('renders an empty breadcrumb', () => {
      expect(wrapper.find(Item)).toHaveLength(1)
      expect(wrapper.find(Item).props().item).toEqual(EMPTY_CRUMB)
    })
  })

  describe('with multiple empty breadcrumbs', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallow(<BreadCrumbs items={[EMPTY_CRUMB, EMPTY_CRUMB, EMPTY_CRUMB]} />)
    })

    test('renders all empty items', () => {
      expect(
        wrapper
          .find(Item)
          .map((itemComponent) => itemComponent.props().item)
          .every((item) => item === EMPTY_CRUMB)
      ).toBeTruthy()
    })
    test('renders each item with unique keys', () => {
      const childItems = wrapper.find(Item)
      expect(childItems).toHaveLength(3)

      const uniqKeys = uniq(childItems.map((i) => i.key()))
      expect(uniqKeys).toHaveLength(3)
    })
  })

  describe('with multiple non-empty breadcrumbs', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallow(<BreadCrumbs items={[CRUMB_A, CRUMB_B, CRUMB_C, CRUMB_D]} />)
    })

    test('renders all items in the correct order', () => {
      expect(wrapper.find(Item)).toHaveLength(4)
      expect(wrapper.find(Item).first().props().item).toEqual(CRUMB_A)
      expect(wrapper.find(Item).last().props().item).toEqual(CRUMB_D)
    })

    test('renders the last item as current', () => {
      expect(findWithProps(wrapper, Item, { current: true })).toHaveLength(1)
      expect(findWithProps(wrapper, Item, { current: true }).props().item).toEqual(CRUMB_D)
    })
  })
})

describe('Item', () => {
  describe('when current is not specified', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Item item={CRUMB_A} />)
    })

    test('renders a list item and a link', () => {
      expect(wrapper.find('li')).toHaveLength(1)
      expect(wrapper.find('a')).toHaveLength(1)
      expect(wrapper.find('a').props().href).toEqual(CRUMB_A.link)
      expect(wrapper.text()).toEqual(CRUMB_A.title)
    })

    test('renders without current class', () => {
      expect(wrapper.find('li.current')).toHaveLength(0)
      expect(wrapper.find('a').prop('aria-current')).toBeUndefined()
    })
  })

  describe('when current is true', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Item item={CRUMB_A} current />)
    })

    test('renders a list item and a link', () => {
      expect(wrapper.find('li')).toHaveLength(1)
      expect(wrapper.find('a')).toHaveLength(1)
      expect(wrapper.find('a').props().href).toEqual(CRUMB_A.link)
      expect(wrapper.text()).toEqual(CRUMB_A.title)
    })

    test('renders with current class', () => {
      expect(wrapper.find('li.current')).toHaveLength(1)
      expect(wrapper.find('a').prop('aria-current')).toEqual('page')
    })
  })

  describe('with empty breadcrumb', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Item item={EMPTY_CRUMB} />)
    })

    test('renders a list item and a link', () => {
      expect(wrapper.find('li')).toHaveLength(1)
      expect(wrapper.find('a')).toHaveLength(1)
      expect(wrapper.find('a').props().href).toEqual('#')
      expect(wrapper.text()).toEqual('')
    })
  })
  describe('when renderAsRouterLink is true', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Item item={CRUMB_ROUTED} />)
    })

    test('renders a NavLink with the correct props', () => {
      expect(wrapper.find(NavLink)).toHaveLength(1)
      expect(wrapper.find(NavLink).props().to).toEqual(CRUMB_ROUTED.link)
      expect(wrapper.find(NavLink).prop('aria-current')).toBeUndefined()
    })
  })

  describe('when renderAsRouterLink is true and item is current', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Item item={CRUMB_ROUTED} current />)
    })

    test('renders a NavLink with the correct props', () => {
      expect(wrapper.find(NavLink)).toHaveLength(1)
      expect(wrapper.find(NavLink).props().to).toEqual(CRUMB_ROUTED.link)
      expect(wrapper.find(NavLink).prop('aria-current')).toEqual('page')
    })
  })
})
