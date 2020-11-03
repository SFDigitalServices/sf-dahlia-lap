import React from 'react'

import ContentSection from 'components/molecules/ContentSection'
import TabCard from 'components/organisms/TabCard'

const TabCardWrapper = () => {
  return (
    <TabCard>
      <ContentSection
        title='Title2'
        subtitle='Sub'
        titleDescription='Some description'
        subtitleDescription='Some sub description'
        label='text input'
        id='text-area'
        name='Area'
        placeholder='Enter Text'
        describeId='label'
        note='More text'
        error='Please enter a First Name'
      />
    </TabCard>
  )
}

export default TabCardWrapper
