import React from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import CheckboxCell from 'components/lease_ups/application_page/CheckboxCell'

const mockOnClick = jest.fn()

describe('CheckboxCell', () => {
  describe('when not checked', () => {
    beforeEach(() => {
      render(<CheckboxCell applicationId='applicationId1' checked={false} onClick={mockOnClick} />)
    })

    test('the input is set to unchecked', () => {
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      fireEvent.click(screen.getByRole('checkbox'))
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })

  describe('when checked', () => {
    beforeEach(() => {
      render(<CheckboxCell applicationId='applicationId1' checked={true} onClick={mockOnClick} />)
    })

    test('the input is set to unchecked', () => {
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    test('onClick is trigged when the input changes', () => {
      expect(mockOnClick.mock.calls).toHaveLength(0)
      fireEvent.click(screen.getByRole('checkbox'))
      expect(mockOnClick.mock.calls).toHaveLength(1)
    })
  })
})
