import React from 'react'
import FormGridRow from '../molecules/FormGridRow'

const TabsCardSection = ({ label, id, name, placeholder, describeId, note, error }) => {
  return (
    <section class="tabs-card-row row full-width inner--3x margin-bottom--2x">
      <FormGridRow label={label} id={id} name={name} placeholder={placeholder} describeId={describeId} note={note} error={error} />
    </section>
  )
}

export default TabsCardSection
