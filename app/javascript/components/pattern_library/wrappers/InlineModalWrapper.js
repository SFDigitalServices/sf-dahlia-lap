import React from 'react'

import ContentSection from '~/components/molecules/ContentSection'
import FormGridRow from '~/components/molecules/FormGridRow'
import InlineModal from '~/components/molecules/InlineModal'
const InlineModalWrapper = () => {
  return (
    <ContentSection title='Section title' description='This is stuff outside of the inline modal'>
      <InlineModal>
        <ContentSection.Sub
          title={'Inline Modal Title'}
          description='This is a sample of what a standard inline modal looks like'
        >
          <FormGridRow
            label='Text input'
            id='text-area'
            name='Area'
            placeholder='Enter text'
            describeId='label'
            note='More text'
          />
          <InlineModal whiteBackground>
            <ContentSection.Sub
              title={'Nested inline modal'}
              description='This is what it looks like when you nest an inline modal inside of another one'
            >
              <FormGridRow
                label='Text input'
                id='text-area'
                name='Area'
                placeholder='Enter text'
                describeId='label'
              />
            </ContentSection.Sub>
          </InlineModal>
        </ContentSection.Sub>
      </InlineModal>
    </ContentSection>
  )
}

export default InlineModalWrapper
