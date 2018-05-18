import React from 'react'
import ContentSection from '../molecules/ContentSection'

const TabCard = ({ children }) => {
  return (
    <section className="tabs-card-row row full-width inner--3x margin-bottom--2x">
      <div className="app-card form-card tabs-card max-width expand-on-small">
        {children}
      </div>
    </section>
  )
}

export default TabCard
