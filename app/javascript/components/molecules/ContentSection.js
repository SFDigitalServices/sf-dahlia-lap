import React from 'react'
import classNames from 'classnames'

const ContentSection = ({ title, description, children }) => (
  <>
    <ContentSection.Header title={title} description={description} />
    {children}
  </>
)

ContentSection.Header = ({ title, description }) => (
  <div className='app-inner'>
    {title && <h2 className='app-card_h2'>{title}</h2>}
    {description && <p className='form-note max-width'>{description}</p>}
  </div>
)

ContentSection.SubHeader = ({ title, description }) => (
  <div className='app-inner'>
    {title && <h3 className='app-card_h3 t-sans'>{title}</h3>}
    {description && <p className='form-note max-width'>{description}</p>}
  </div>
)

ContentSection.Content = ({ children, borderBottom, paddingBottomNone, marginTop }) => {
  const divClassName = classNames(
    'app-inner',
    {
      'border-bottom': borderBottom,
      'padding-bottom-none': paddingBottomNone,
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
