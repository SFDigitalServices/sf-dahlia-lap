import React from 'react'
import classNames from 'classnames'
import { Text } from 'react-form'
import { BlockNote } from '~/utils/form/Field'
import { FormError, errorClassName } from './errors'

export const MultiDateField = ({ formApi, field, label, id, blockNote, errorMessage }) => {
  const className = errorClassName(formApi, field)

  return (
    <div className={classNames('form-group', className)}>
      <label className='form-label' htmlFor={field}>
        {`${label} `}
        {blockNote && <BlockNote value={blockNote} />}
      </label>
      <div className='form-group-month'>
        <Text
          className={classNames(className)}
          field={[field, 1]}
          id={id + '_month'}
          placeholder='MM'
          type='number' />
      </div>
      <div className='form-group-day'>
        <Text
          className={classNames(className)}
          field={[field, 2]}
          id={id + '_day'}
          placeholder='DD'
          type='number' />
      </div>
      <div className='form-group-year'>
        <Text
          className={classNames(className)}
          field={[field, 0]}
          id={id + '_year'}
          placeholder='YYYY'
          type='number' />
      </div>
      <div className='d-inline-block'>
        <FormError formApi={formApi} label={label} field={field} errorMessage={errorMessage} />
      </div>
    </div>
  )
}
