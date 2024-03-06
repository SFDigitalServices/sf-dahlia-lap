import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import Checkbox from 'components/atoms/Checkbox'

const mockOnClick = jest.fn()

describe('Checkbox', () => {
  describe('when not checked', () => {
    beforeEach(() => {
      render(<Checkbox id='checkbox-id' onClick={mockOnClick} />)
    })

    test('renders an input and a label', () => {
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByTestId('checkbox-label')).toBeInTheDocument()
    })

    test('the input is set to unchecked', () => {
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      fireEvent.click(screen.getByRole('checkbox'))
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })

    test('the input does not have indeterminate class', () => {
      expect(screen.getByRole('checkbox')).not.toHaveClass('indeterminate')
    })
  })

  describe('when checked', () => {
    beforeEach(() => {
      render(<Checkbox id='checkbox-id' checked onClick={mockOnClick} />)
    })

    test('renders an input and a label', () => {
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
      expect(screen.getByTestId('checkbox-label')).toBeInTheDocument()
    })

    test('the input is set to unchecked', () => {
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      fireEvent.click(screen.getByRole('checkbox'))
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })

    test('the input does not have indeterminate class', () => {
      expect(screen.getByRole('checkbox')).not.toHaveClass('indeterminate')
    })
  })

  describe('when indeterminate', () => {
    describe('when checked', () => {
      beforeEach(() => {
        render(<Checkbox id='checkbox-id' indeterminate checked onClick={mockOnClick} />)
      })

      test('the input is set to checked', () => {
        expect(screen.getByRole('checkbox')).toBeChecked()
      })

      test('the input has indeterminate class', () => {
        expect(screen.getByRole('checkbox')).toHaveClass('indeterminate')
      })
    })

    describe('when not checked', () => {
      beforeEach(() => {
        render(<Checkbox id='checkbox-id' indeterminate onClick={mockOnClick} />)
      })

      test('the input is set to checked', () => {
        // the input should still be checked even if checked is false,
        // because indeterminate is a variation on the checked state.
        expect(screen.getByRole('checkbox')).toBeChecked()
      })

      test('the input has indeterminate class', () => {
        expect(screen.getByRole('checkbox')).toHaveClass('indeterminate')
      })
    })
  })
})
