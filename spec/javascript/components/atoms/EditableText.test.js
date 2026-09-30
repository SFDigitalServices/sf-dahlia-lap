import React, { useState } from 'react'

import { fireEvent, render, screen } from '@testing-library/react'

import EditableText from 'components/atoms/EditableText'

// mirrors how the lottery results page uses the component: the parent owns
// the value and updates it from onSave
const ControlledEditableText = ({ initialValue, onSave, ...rest }) => {
  const [value, setValue] = useState(initialValue)
  return (
    <EditableText
      value={value}
      onSave={(newValue) => {
        onSave(newValue)
        setValue(newValue)
      }}
      {...rest}
    />
  )
}

describe('EditableText', () => {
  let mockOnSave

  beforeEach(() => {
    mockOnSave = jest.fn()
  })

  const renderControlled = (props = {}) =>
    render(<ControlledEditableText initialValue='Original' onSave={mockOnSave} {...props} />)

  const startEditing = () => fireEvent.click(screen.getByRole('button', { name: /Original/ }))

  describe('when not editing', () => {
    test('renders the value as a focusable button without an input', () => {
      renderControlled()

      const view = screen.getByRole('button', { name: 'Original' })
      expect(view).toHaveClass('editable-text')
      expect(view).toHaveAttribute('tabindex', '0')
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    test('shows the placeholder when the value is empty', () => {
      render(<EditableText value='' onSave={mockOnSave} />)

      expect(screen.getByRole('button', { name: 'Click to edit' })).toBeInTheDocument()
    })

    test('shows the placeholder when the value is null', () => {
      render(<EditableText onSave={mockOnSave} placeholder='Add a subtitle' />)

      expect(screen.getByRole('button', { name: 'Add a subtitle' })).toBeInTheDocument()
    })

    test('uses the label in the accessible name', () => {
      renderControlled({ label: 'listing name' })

      expect(
        screen.getByRole('button', { name: 'Edit listing name: Original' })
      ).toBeInTheDocument()
    })
  })

  describe('entering edit mode', () => {
    test('clicking the text shows a focused input with the value and save/cancel buttons', () => {
      renderControlled()
      startEditing()

      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('Original')
      expect(input).toHaveFocus()
      expect(input).toHaveAttribute('placeholder', 'Click to edit')
      expect(input).toHaveAttribute('autocomplete', 'off')
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    test.each(['Enter', ' '])('pressing %p on the focused text starts editing', (key) => {
      renderControlled()
      fireEvent.keyDown(screen.getByRole('button', { name: 'Original' }), { key })

      expect(screen.getByRole('textbox')).toHaveValue('Original')
    })

    test('other keys on the text do not start editing', () => {
      renderControlled()
      fireEvent.keyDown(screen.getByRole('button', { name: 'Original' }), { key: 'a' })

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })

    test('labels the input and buttons when a label is given', () => {
      renderControlled({ label: 'listing name' })
      fireEvent.click(screen.getByRole('button', { name: 'Edit listing name: Original' }))

      expect(screen.getByRole('textbox', { name: 'listing name' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Save listing name' })).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Cancel editing listing name' })
      ).toBeInTheDocument()
    })

    test('starts with an empty input when the value is null', () => {
      render(<EditableText onSave={mockOnSave} />)
      fireEvent.click(screen.getByRole('button', { name: 'Click to edit' }))

      expect(screen.getByRole('textbox')).toHaveValue('')
    })
  })

  describe('saving', () => {
    test('clicking Save calls onSave with the new value and shows it', () => {
      renderControlled()
      startEditing()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated' } })
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      expect(mockOnSave).toHaveBeenCalledTimes(1)
      expect(mockOnSave).toHaveBeenCalledWith('Updated')
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Updated' })).toHaveFocus()
    })

    test('pressing Enter in the input saves', () => {
      renderControlled()
      startEditing()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated' } })
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })

      expect(mockOnSave).toHaveBeenCalledWith('Updated')
      expect(screen.getByRole('button', { name: 'Updated' })).toBeInTheDocument()
    })

    test('saving an unchanged value still calls onSave', () => {
      renderControlled()
      startEditing()
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      expect(mockOnSave).toHaveBeenCalledWith('Original')
    })
  })

  describe('cancelling', () => {
    test('clicking Cancel discards the edit without calling onSave', () => {
      renderControlled()
      startEditing()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Discarded' } })
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(mockOnSave).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Original' })).toHaveFocus()
    })

    test('pressing Escape discards the edit without calling onSave', () => {
      renderControlled()
      startEditing()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Discarded' } })
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Escape' })

      expect(mockOnSave).not.toHaveBeenCalled()
      expect(screen.getByRole('button', { name: 'Original' })).toBeInTheDocument()
    })

    test('the next edit starts from the saved value, not the discarded one', () => {
      renderControlled()
      startEditing()
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Discarded' } })
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      startEditing()

      expect(screen.getByRole('textbox')).toHaveValue('Original')
    })

    test('other keys in the input do not save or cancel', () => {
      renderControlled()
      startEditing()
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'a' })

      expect(mockOnSave).not.toHaveBeenCalled()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  test('does not move focus on first render', () => {
    renderControlled()

    expect(screen.getByRole('button', { name: 'Original' })).not.toHaveFocus()
  })
})
