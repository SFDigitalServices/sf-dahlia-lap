import React from 'react'

const ContentSection = ({title, description, children}) => (
  <React.Fragment>
    <ContentSection.Header title={title} description={description}/>
    {children}
  </React.Fragment>
)

ContentSection.Header = ({title, description}) => (
  <div className='app-inner header-wide'>
    <h2 className="app-card_h2">{title}</h2>
    {description && <p className="form-note max-width">{description}</p>}
  </div>
)

ContentSection.SubHeader = ({title , description}) => (
  <div className="app-inner subheader-wide">
    <h3 className="app-card_h3 t-sans">{title}</h3>
    {description && <p className="form-note max-width">{description}</p>}
  </div>
)

ContentSection.Content = ({children, border}) => (
  <div className={`app-inner inset-wide ${border ? 'border-bottom' : ''}`}>
    {children}
  </div>
)

ContentSection.Sub = ({title, description, border = true, children}) => (
  <React.Fragment>
    <ContentSection.SubHeader title={title} description={description} />
    <ContentSection.Content border={border}>
      {children}
    </ContentSection.Content>
  </React.Fragment>
)

export default ContentSection
