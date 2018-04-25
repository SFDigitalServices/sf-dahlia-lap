import React from 'react'
import FormGridRow from '../molecules/FormGridRow'

const ContentSection = ({ title, subtitle, label, id, name, placeholder, describeId, note, error }) => {
  return (
    <div class="content-section">
      <div class="app-inner header-wide">
        <h3 class="app-card_h2">{title}</h3>
        <p class="form-note max-width">{subtitle}</p>
      </div>
      <div class="app-inner inset-wide border-bottom">
        <FormGridRow label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
      </div>
    </div>
  )
}

export default ContentSection
