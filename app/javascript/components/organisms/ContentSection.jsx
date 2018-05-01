import React from 'react'
import FormGridRow from '../molecules/FormGridRow'

const ContentSection = ({ title, subtitle, label, id, name, placeholder, describeId, note, error }) => {
  return (
    <div className="content-section">
      <div className="app-inner header-wide">
        <h3 className="app-card_h2">{title}</h3>
        <p className="form-note max-width">{subtitle}</p>
      </div>
      <div className="app-inner inset-wide border-bottom">
        <FormGridRow label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
      </div>
    </div>
  )
}

export default ContentSection
