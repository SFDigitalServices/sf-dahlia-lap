import React from 'react'

import { shallow } from 'enzyme'

import BreadCrumbs from 'components/atoms/BreadCrumbs'
import PageHeader, { Actions, DefaultAction } from 'components/organisms/PageHeader'

const mockCrumb = (title, link) => ({
  title,
  link
})

const CRUMB_A = mockCrumb('A', '/a')
const TITLE = 'title1'
const CONTENT = 'content1'
const ACTION = { link: '/export', title: 'Export' }

describe('PageHeader', () => {
  const getWrapper = (breadcrumbs, { action = ACTION, title = TITLE, content = CONTENT } = {}) => {
    return shallow(
      <PageHeader title={title} content={content} action={action} breadcrumbs={breadcrumbs} />
    )
  }

  describe('with breadcrumbs not specified', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper(undefined)
    })

    test('should not render BreadCrumbs when empty', () => {
      expect(wrapper.find(BreadCrumbs)).toHaveLength(0)
    })

    test('should not render the header with has-breadcrumbs style', () => {
      expect(wrapper.find('header.has-breadcrumbs')).toHaveLength(0)
    })

    test('should render the header with serif', () => {
      expect(wrapper.find('h1').hasClass('small-serif')).toBeTruthy()
      expect(wrapper.find('h1').hasClass('small')).toBeFalsy()
    })
  })

  describe('with empty breadcrumbs array', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper([])
    })

    test('should not render the header with has-breadcrumbs style', () => {
      expect(wrapper.find('header.has-breadcrumbs')).toHaveLength(0)
    })

    test('should not render BreadCrumbs when empty', () => {
      expect(wrapper.find(BreadCrumbs)).toHaveLength(0)
    })

    test('should render the header with serif', () => {
      expect(wrapper.find('h1').hasClass('small-serif')).toBeTruthy()
      expect(wrapper.find('h1').hasClass('small')).toBeFalsy()
    })
  })

  describe('with non-empty values', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper([CRUMB_A])
    })

    test('should not render the header with has-breadcrumbs style', () => {
      expect(wrapper.find('header.has-breadcrumbs')).toHaveLength(1)
    })

    test('should render BreadCrumbs', () => {
      expect(wrapper.find(BreadCrumbs)).toHaveLength(1)
    })

    test('should render an Actions component', () => {
      expect(wrapper.find(Actions)).toHaveLength(1)
    })

    test('should render the title and content', () => {
      expect(wrapper.find('hgroup').text()).toContain(TITLE)
      expect(wrapper.find('hgroup').text()).toContain(CONTENT)
    })

    test('should render the header without serif', () => {
      expect(wrapper.find('h1').hasClass('small-serif')).toBeFalsy()
      expect(wrapper.find('h1').hasClass('small')).toBeTruthy()
    })
  })

  describe('when content is empty', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper([CRUMB_A], { content: null })
    })

    test('does not render a content section', () => {
      expect(wrapper.find('p')).toHaveLength(0)
    })
  })

  describe('when title is a node', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper([CRUMB_A], { title: <div>titleNode</div> })
    })

    test('does not render a content section', () => {
      expect(wrapper.text()).toContain('titleNode')
    })
  })
})

describe('Actions', () => {
  describe('when actions prop is null', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Actions />)
    })

    test('renders no action', () => {
      expect(wrapper).toEqual({})
    })
  })

  describe('when actions prop is populated with an object with a title', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Actions actions={ACTION} />)
    })

    test('renders the action as a DefaultAction', () => {
      expect(wrapper.find(DefaultAction)).toHaveLength(1)
    })
  })

  describe('when actions is populated with object without a title', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Actions actions={'stringAction'} />)
    })

    test('renders the action directly', () => {
      expect(wrapper.find(DefaultAction)).toHaveLength(0)
      expect(wrapper.text()).toEqual('stringAction')
    })
  })

  describe('when actions is an array of one object', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Actions actions={[ACTION]} />)
    })

    test('renders the action as a DefaultAction', () => {
      expect(wrapper.find(DefaultAction)).toHaveLength(1)
    })
  })

  describe('when actions is an array of multiple object', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(<Actions actions={[ACTION, ACTION, ACTION]} />)
    })

    test('renders all actions', () => {
      expect(wrapper.find(DefaultAction)).toHaveLength(3)
    })
  })
})
