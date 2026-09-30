import React, { useEffect, useRef, useState } from 'react'

import PropTypes from 'prop-types'

const isEmpty = (value) => value === null || value === undefined || value === ''

/**
 * Click-to-edit text. Shows the value as text; clicking it (or pressing
 * Enter/Space when it has focus) swaps in a text input with Save and Cancel
 * buttons. Enter in the input saves, Escape cancels. onSave is called with the
 * new value, and the parent is expected to pass it back in as `value`.
 */
const EditableText = ({ value = null, onSave, label = null, placeholder = 'Click to edit' }) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value ?? '')
  const viewRef = useRef(null)
  // only move focus back to the text after an edit, not on the first render
  const returnFocus = useRef(false)

  useEffect(() => {
    if (!editing && returnFocus.current) {
      returnFocus.current = false
      viewRef.current?.focus()
    }
  }, [editing])

  const startEditing = () => {
    setDraft(value ?? '')
    setEditing(true)
  }

  const stopEditing = () => {
    returnFocus.current = true
    setEditing(false)
  }

  const handleSave = () => {
    stopEditing()
    onSave(draft)
  }

  const handleViewKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      startEditing()
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
  }

  const handleEditorKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      stopEditing()
    }
  }

  if (!editing) {
    return (
      <div
        ref={viewRef}
        className='editable-text'
        role='button'
        tabIndex={0}
        aria-label={label ? `Edit ${label}: ${isEmpty(value) ? placeholder : value}` : undefined}
        onClick={startEditing}
        onKeyDown={handleViewKeyDown}
      >
        {isEmpty(value) ? placeholder : value}
      </div>
    )
  }

  return (
    <div className='editable-text-editor' onKeyDown={handleEditorKeyDown}>
      <div className='editable-text-input-wrapper'>
        <input
          // focus the input as soon as editing starts, like react-easy-edit did
          autoFocus
          type='text'
          value={draft}
          placeholder={placeholder}
          autoComplete='off'
          aria-label={label ?? undefined}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>
      <div className='editable-text-buttons'>
        <button
          type='button'
          className='editable-text-button'
          name='save'
          aria-label={label ? `Save ${label}` : undefined}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type='button'
          className='editable-text-button'
          name='cancel'
          aria-label={label ? `Cancel editing ${label}` : undefined}
          onClick={stopEditing}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

EditableText.propTypes = {
  value: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string
}

export default EditableText
