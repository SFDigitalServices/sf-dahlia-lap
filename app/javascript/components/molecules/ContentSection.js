import React from 'react'
import classNames from 'classnames'

const ContentSection = ({ title, description, children }) => (
  <div className='app-inner padding-bottom--half'>
    <ContentSection.Header title={title} description={description} />
    {children}
  </div>
)

ContentSection.Header = ({ title, description }) => (
  <div>
    {title && <h2 className='app-card_h2'>{title}</h2>}
    {description && <p className='form-note max-width margin-bottom--3halves'>{description}</p>}
  </div>
)

ContentSection.SubHeader = ({ title, description }) => (
  <div>
    {title && <h3 className='app-card_h3 t-sans'>{title}</h3>}
    {description && <p className='form-note max-width margin-bottom--3halves'>{description}</p>}
  </div>
)

ContentSection.Content = ({ children, borderBottom, marginTop }) => {
  const divClassName = classNames(
    {
      'border-bottom': borderBottom,
      'margin-top': marginTop
    }
  )
  return (
    <div className={divClassName}>
      {children}
    </div>
  )
}

ContentSection.Sub = ({ title, description, borderBottom = false, children }) => (
  <>
    <ContentSection.SubHeader title={title} description={description} />
    <ContentSection.Content borderBottom={borderBottom}>
      {children}
    </ContentSection.Content>
  </>
)

export default ContentSection
