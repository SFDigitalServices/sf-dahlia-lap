import React from 'react'

import ContentSection from 'components/molecules/ContentSection'
import FormGridRow from 'components/molecules/FormGridRow'

const ContentSectionWrapper = ({ title, titleDesc, subtitle, subtitleDesc }) => {
  return (
    <ContentSection title={title} description={titleDesc}>
      <ContentSection.Sub title={subtitle} description={subtitleDesc}>
        <FormGridRow
          label='Text input'
          id='text-area'
          name='Area'
          placeholder='Enter text'
          describeId='label'
          note='More text'
          error='Please enter a First Name'
        />
      </ContentSection.Sub>
    </ContentSection>
  )
}

export default ContentSectionWrapper
