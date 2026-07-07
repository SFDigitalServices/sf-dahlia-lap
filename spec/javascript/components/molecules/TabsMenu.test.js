import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import TabsMenu, { Tab } from 'components/molecules/TabsMenu'

const mockTabItem = ({
  title,
  url,
  active,
  onClick,
  renderAsRouterLink,
  isUpdated,
  className
}) => ({
  title,
  url,
  active,
  renderAsRouterLink,
  onClick,
  isUpdated,
  className
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
const ITEM_ONCLICK_UPDATED = mockTabItem({
  title: 'itemOnClickUpdated',
  onClick: mockOnClick,
  isUpdated: true,
  className: 'application-updated-button'
})

describe('TabsMenu', () => {
  describe('with a single active tab', () => {
    beforeEach(() => {
      render(<TabsMenu items={[ITEM_ACTIVE]} />)
    })

    test('should render one tab with the correct props', () => {
      const menuItem = screen.getByRole('menuitem')
      expect(screen.getByRole('menuitem')).toBeInTheDocument()
      expect(menuItem).toHaveTextContent(ITEM_ACTIVE.title)
      expect(menuItem).toHaveAttribute('href', ITEM_ACTIVE.url)
      expect(menuItem).toHaveAttribute('aria-selected', 'true')
    })
  })

  describe('with multiple tabs', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <TabsMenu items={[ITEM_BASIC, ITEM_ACTIVE, ITEM_ROUTED]} />
        </BrowserRouter>
      )
    })

    test('should render each tab with the correct props', () => {
      expect(screen.getAllByRole('menuitem')).toHaveLength(3)

      expect(screen.getByRole('menuitem', { name: ITEM_BASIC.title })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: ITEM_ACTIVE.title })).toBeInTheDocument()
      expect(screen.getByRole('menuitem', { name: ITEM_ROUTED.title })).toBeInTheDocument()
    })
  })
})

describe('Tab', () => {
  describe('when active', () => {
    beforeEach(() => {
      render(<Tab tabItem={ITEM_ACTIVE} />)
    })

    test('renders an <a /> link', () => {
      const link = screen.getByRole('menuitem')
      expect(link).toHaveAttribute('href', ITEM_ACTIVE.url)
      expect(link).toHaveTextContent(ITEM_ACTIVE.title)
    })

    test('does not trigger onClick', () => {
      const link = screen.getByRole('menuitem')
      fireEvent.click(link)
      expect(mockOnClick.mock.calls).toHaveLength(0)
    })

    test('renders the list item with the active class', () => {
      const listItem = screen.getByRole('menuitem', { name: 'itemActive' }).parentNode
      expect(listItem).toHaveClass('active')
    })
  })

  describe('when linking to a single page app url', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <Tab tabItem={ITEM_ROUTED} />
        </BrowserRouter>
      )
    })

    test('renders a react router <Link />', () => {
      const link = screen.getByRole('menuitem')
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', ITEM_ROUTED.url)
      expect(link).toHaveTextContent(ITEM_ROUTED.title)
    })

    test('does not trigger onClick', () => {
      fireEvent.click(screen.getByRole('menuitem'))
      expect(mockOnClick.mock.calls).toHaveLength(0)
    })
  })

  describe('when onClick specified', () => {
    beforeEach(() => {
      render(<Tab tabItem={ITEM_ONCLICK} />)
    })

    test('renders a button', () => {
      const button = screen.getByRole('menuitem')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveTextContent(ITEM_ONCLICK.title)
    })

    test('triggers onClick properly', () => {
      fireEvent.click(screen.getByRole('menuitem'))
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })

    test('renders updated badge with class when tab is updated', () => {
      render(<Tab tabItem={ITEM_ONCLICK_UPDATED} />)
      const button = screen.getByRole('menuitem', { name: /itemOnClickUpdated/i })

      expect(screen.getByText('Contact updated')).toBeInTheDocument()
      expect(screen.getByText('Contact updated')).toHaveClass('application-contact-updated-alert')
      expect(button).toHaveClass('application-updated-button')
    })
  })

  describe('when a url is specified', () => {
    beforeEach(() => {
      render(<Tab tabItem={{ ...ITEM_ONCLICK, url: '/testUrl' }} />)
    })

    test('still renders a button', () => {
      const button = screen.getByRole('menuitem')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveTextContent(ITEM_ONCLICK.title)
    })

    test('triggers onClick properly', () => {
      fireEvent.click(screen.getByRole('menuitem'))
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })
})
