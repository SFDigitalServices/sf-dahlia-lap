import React from 'react'
import PropTypes from 'prop-types'
import BreadCrumbs from '../atoms/BreadCrumbs'

const PageHeader = ({ title, content, action, breadcrumbs }) => {
  return (
    <header className="lead-header short has-breadcrumbs bg-dust">
      <div className="row full-width inner--3x">
        <div className="large-12 columns">
          { breadcrumbs && <BreadCrumbs items={breadcrumbs}/>}
          <hgroup className="lead-header_group">
            <h1 className="lead-header_title small c-oil">{title}</h1>
            <div className="medium-8 columns no-padding">
              <p>{content}</p>
            </div>
            <div className="medium-4 columns no-padding">
              { action && <span className="lead-header_secondary-action"><a href={action.link} className="alt-caps">{action.title}</a></span> }
            </div>
          </hgroup>
        </div>
      </div>
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  action: PropTypes.object,
  breadcrumbs: PropTypes.array,
}

export default PageHeader
