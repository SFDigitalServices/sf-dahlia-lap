import React from 'react'

import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'

import BreadCrumbs, { Item } from 'components/atoms/BreadCrumbs'

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
    beforeEach(() => {
      render(<BreadCrumbs items={[]} />)
    })

    test('renders no items', () => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    })
  })

  describe('with only one non-empty breadcrumb', () => {
    beforeEach(() => {
      render(<BreadCrumbs items={[CRUMB_A]} />)
    })

    test('renders one item', () => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(1)
      expect(
        screen.getByRole('link', {
          name: /a/i
        })
      ).toBeInTheDocument()
    })

    test('renders the item as current', () => {
      expect(
        screen.getByRole('link', {
          name: /a/i
        })
      ).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('with one empty breadcrumb', () => {
    beforeEach(() => {
      render(<BreadCrumbs items={[EMPTY_CRUMB]} />)
    })

    test('renders an empty breadcrumb', () => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(1)
      expect(screen.getByRole('link')).toHaveAttribute('href', '#')
    })
  })

  describe('with multiple empty breadcrumbs', () => {
    beforeEach(() => {
      render(<BreadCrumbs items={[EMPTY_CRUMB, EMPTY_CRUMB, EMPTY_CRUMB]} />)
    })

    test('renders all empty items', () => {
      expect(screen.queryAllByRole('listitem')).toHaveLength(3)

      screen.queryAllByRole('link').forEach((item) => expect(item).toHaveAttribute('href', '#'))
    })
  })

  describe('with multiple non-empty breadcrumbs', () => {
    beforeEach(() => {
      render(<BreadCrumbs items={[CRUMB_A, CRUMB_B, CRUMB_C, CRUMB_D]} />)
    })

    test('renders all items in the correct order', () => {
      const crumbs = screen.queryAllByRole('link')
      expect(crumbs).toHaveLength(4)
      expect(crumbs[0]).toHaveAttribute('href', CRUMB_A.link)
      expect(crumbs.pop()).toHaveAttribute('href', CRUMB_D.link)
    })

    test('renders the last item as current', () => {
      expect(
        screen.getByRole('link', {
          name: /d/i
        })
      ).toHaveAttribute('aria-current', 'page')
    })
  })
})

describe('Item', () => {
  describe('when current is not specified', () => {
    beforeEach(() => {
      render(<Item item={CRUMB_A} />)
    })

    test('renders a list item and a link', () => {
      expect(
        screen.getByRole('link', {
          name: /a/i
        })
      ).toHaveAttribute('href', CRUMB_A.link)
      expect(screen.getByText(CRUMB_A.title)).toBeInTheDocument()
    })

    test('renders without current class', () => {
      expect(
        screen.getByRole('link', {
          name: /a/i
        })
      ).not.toHaveAttribute('aria-current', 'page')
    })
  })

  describe('when current is true', () => {
    beforeEach(() => {
      render(<Item item={CRUMB_A} current />)
    })

    test('renders a list item and a link', () => {
      expect(
        screen.getByRole('link', {
          name: /a/i
        })
      ).toHaveAttribute('href', CRUMB_A.link)
      expect(screen.getByText(CRUMB_A.title)).toBeInTheDocument()
    })

    test('renders with current class', () => {
      expect(
        screen.getByRole('link', {
          name: /a/i
        })
      ).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('with empty breadcrumb', () => {
    beforeEach(() => {
      render(<Item item={EMPTY_CRUMB} />)
    })

    test('renders a list item and a link', () => {
      expect(screen.getByRole('link')).toHaveAttribute('href', '#')
    })
  })
  describe('when renderAsRouterLink is true', () => {
    beforeEach(() => {
      render(
        <Router initialEntries={['/']}>
          <Item item={CRUMB_ROUTED} />
        </Router>
      )
    })

    test('renders a NavLink with the correct props', () => {
      expect(
        screen.getByRole('link', {
          name: /e/i
        })
      ).toHaveAttribute('href', CRUMB_ROUTED.link)
      expect(
        screen.getByRole('link', {
          name: /e/i
        })
      ).not.toHaveAttribute('aria-current', 'page')
    })
  })

  describe('when renderAsRouterLink is true and item is current', () => {
    beforeEach(() => {
      render(
        <Router initialEntries={['/']}>
          <Item item={CRUMB_ROUTED} current />
        </Router>
      )
    })

    test('renders a NavLink with the correct props', () => {
      expect(
        screen.getByRole('link', {
          name: /e/i
        })
      ).toHaveAttribute('href', CRUMB_ROUTED.link)
      expect(screen.getByRole('listitem')).toHaveClass('current')
    })
  })
})
