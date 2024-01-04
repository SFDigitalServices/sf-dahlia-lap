import React from 'react'

import { render, screen, within } from '@testing-library/react'

import PageHeader, { Actions } from 'components/organisms/PageHeader'

const mockCrumb = (title, link) => ({
  title,
  link
})

const CRUMB_A = mockCrumb('A', '/a')
const TITLE = 'title1'
const CONTENT = 'content1'
const ACTION = { link: '/export', title: 'Export' }

describe('PageHeader', () => {
  const getScreen = (breadcrumbs, { action = ACTION, title = TITLE, content = CONTENT } = {}) => {
    return render(
      <PageHeader title={title} content={content} action={action} breadcrumbs={breadcrumbs} />
    )
  }

  describe('with breadcrumbs not specified', () => {
    beforeEach(() => {
      getScreen(undefined)
    })

    test('should not render BreadCrumbs when empty', () => {
      expect(screen.queryByLabelText('breadcrumb')).not.toBeInTheDocument()
    })

    test('should not render the header with has-breadcrumbs style', () => {
      expect(screen.queryByRole('banner')).not.toHaveClass('has-breadcrumbs')
    })

    test('should render the header with serif', () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('small-serif')
      expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass('small')
    })
  })

  describe('with empty breadcrumbs array', () => {
    beforeEach(() => {
      getScreen([])
    })

    test('should not render the header with has-breadcrumbs style', () => {
      expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass('has-breadcrumb')
    })

    test('should not render BreadCrumbs when empty', () => {
      expect(screen.queryByLabelText('breadcrumb')).not.toBeInTheDocument()
    })

    test('should render the header with serif', () => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('small-serif')
      expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass('small')
    })
  })

  describe('with non-empty values', () => {
    beforeEach(() => {
      getScreen([CRUMB_A])
    })

    test('should not render the header with has-breadcrumbs style', () => {
      expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass('has-breadcrumb')
    })

    test('should render BreadCrumbs', () => {
      expect(screen.getByLabelText('breadcrumb')).toBeInTheDocument()
    })

    test('should render an Actions component', () => {
      expect(
        screen.getByRole('link', {
          name: /export/i
        })
      ).toBeInTheDocument()
    })

    test('should render the title and content', () => {
      expect(
        screen.getByRole('heading', {
          name: /title1/i
        })
      ).toBeInTheDocument()
      expect(screen.getByText(CONTENT)).toBeInTheDocument()
    })

    test('should render the header without serif', () => {
      expect(screen.getByRole('heading', { level: 1 })).not.toHaveClass('small-serif')
      expect(screen.getByRole('heading', { level: 1 })).toHaveClass('small')
    })
  })

  describe('when content is empty', () => {
    test('does not render a content section', () => {
      const { asFragment } = getScreen([CRUMB_A], { content: null })
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when title is a node', () => {
    beforeEach(() => {
      getScreen([CRUMB_A], { title: <div>titleNode</div> })
    })

    test('does not render a content section', () => {
      expect(screen.getByText('titleNode')).toBeInTheDocument()
    })
  })
})

describe('Actions', () => {
  describe('when actions prop is null', () => {
    beforeEach(() => {
      render(<Actions />)
    })

    test('renders no action', () => {
      expect(screen.queryByTestId('page-header-action')).not.toBeInTheDocument()
    })
  })

  describe('when actions prop is populated with an object with a title', () => {
    beforeEach(() => {
      render(<Actions actions={ACTION} />)
    })

    test('renders the action as a DefaultAction', () => {
      expect(screen.getByTestId('page-header-default-action')).toBeInTheDocument()
      expect(
        screen.getByRole('link', {
          name: /export/i
        })
      ).toHaveAttribute('href', '/export')
    })
  })

  describe('when actions is populated with object without a title', () => {
    beforeEach(() => {
      render(<Actions actions={'stringAction'} />)
    })

    test('renders the action directly', () => {
      expect(screen.queryByTestId('page-header-default-action')).not.toBeInTheDocument()
      expect(
        within(screen.getByTestId('page-header-action')).getByText('stringAction')
      ).toBeInTheDocument()
    })
  })

  describe('when actions is an array of one object', () => {
    beforeEach(() => {
      render(<Actions actions={[ACTION]} />)
    })

    test('renders the action as a DefaultAction', () => {
      expect(screen.getByTestId('page-header-default-action')).toBeInTheDocument()
    })
  })

  describe('when actions is an array of multiple object', () => {
    beforeEach(() => {
      render(<Actions actions={[ACTION, ACTION, ACTION]} />)
    })

    test('renders all actions', () => {
      expect(screen.getAllByTestId('page-header-default-action')).toHaveLength(3)
    })
  })
})
