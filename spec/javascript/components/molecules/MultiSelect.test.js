import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import selectEvent from 'react-select-event'

import MultiSelect from 'components/molecules/MultiSelect'

const mockItems = [
  {
    value: 'item1',
    label: 'Item1'
  },
  {
    value: 'item2',
    label: 'Item2'
  },
  {
    value: 'item3',
    label: 'Item3'
  }
]

describe('MultiSelect', () => {
  describe('when items is null', () => {
    beforeEach(() => {
      render(
        <form>
          <MultiSelect />
        </form>
      )
    })

    test('should render no items or selectedItems', () => {
      expect(screen.getByRole('combobox')).toHaveValue('')
      fireEvent.click(screen.getByRole('combobox'))
    })
  })

  describe('with multiple items', () => {
    beforeEach(() => {
      render(
        <form role='form' data-testid='form'>
          <MultiSelect options={mockItems} name='formTest' onChange={() => {}} />
        </form>
      )
    })

    test('renders no selected items', () => {
      expect(screen.getByTestId('form')).toHaveFormValues({ formTest: '' })
    })

    test('renders the items', async () => {
      await selectEvent.openMenu(screen.getByRole('combobox'))
      expect(screen.getByText('Item1')).toBeInTheDocument()
      expect(screen.getByText('Item2')).toBeInTheDocument()
      expect(screen.getByText('Item3')).toBeInTheDocument()
    })

    test('is not disabled', () => {
      expect(screen.getByTestId('form')).toHaveFormValues({ formTest: '' })
      expect(screen.getByRole('combobox')).toBeEnabled()
    })
  })

  describe('when disabled', () => {
    test('renders as disabled', () => {
      const { asFragment } = render(<MultiSelect options={mockItems} disabled />)
      // React-select applies an aria-disabled attribute to a parent div, making it hard to find
      // The disabled attribute is captured by the snapshot
      expect(asFragment()).toMatchSnapshot()
    })
  })

  describe('when one item is selected', () => {
    beforeEach(() => {
      render(
        <form role='form' data-testid='form'>
          <MultiSelect options={mockItems} value={[mockItems[0]]} disabled />
        </form>
      )
    })

    test('should pass that item to react-select', () => {
      expect(screen.getByText('Item1')).toBeInTheDocument()
      expect(screen.queryByText('Item2')).not.toBeInTheDocument()
      // expect(wrapper.find(Select).props().value).toEqual([mockItems[0]])
    })
  })

  describe('with default height', () => {
    test('sets height to 45px', () => {
      const { asFragment } = render(<MultiSelect items={mockItems} />)
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
