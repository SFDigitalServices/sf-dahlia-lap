import React from 'react'
import ContentSection from '../organisms/ContentSection'

const TabCard = ({ title, subtitle, label, id, name, placeholder, describeId, note, error }) => {
  return (
    <section className="tabs-card-row row full-width inner--3x margin-bottom--2x">
      <div className="app-card form-card tabs-card max-width expand-on-small">
        <ContentSection title={title} subtitle={subtitle} label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
      </div>
    </section>
  )
}

export default TabCard
