import React from 'react'

import FormGridRow from '../molecules/FormGridRow'

const ContentSectionBordered = ({
  title,
  subtitle,
  titleDescription,
  subtitleDescription,
  label,
  id,
  name,
  placeholder,
  describeId,
  note,
  error
}) => {
  return (
    <div className='content-section'>
      <div className='app-inner header-wide'>
        <h3 className='app-card_h2'>{title}</h3>
        <p className='form-note max-width'>{titleDescription}</p>
      </div>
      <div className='app-inner subheader-wide'>
        <h3 className='app-card_h3 t-sans'>{subtitle}</h3>
        <p className='form-note max-width'>{subtitleDescription}</p>
      </div>
      <div className='app-inner inset-wide has-border margin-top'>
        <FormGridRow
          label={label}
          id={id}
          name={name}
          placeholder={placeholder}
          describeId={describeId}
          note={note}
          error={error}
        />
      </div>
    </div>
  )
}

export default ContentSectionBordered
