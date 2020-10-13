import React from 'react'
import PropTypes from 'prop-types'
import BreadCrumbs from '../atoms/BreadCrumbs'

import { map, has, isArray } from 'lodash'

// Visible for testing
export const DefaultAction = ({ action }) => (
  <a href={action.link} className='alt-caps'>
    {action.title}
  </a>
)

// Visible for testing
export const Actions = ({ actions }) => {
  if (actions) {
    const cleanedActions = isArray(actions) ? actions : [actions]
    const actionsList = map(cleanedActions, (action, idx) =>
      has(action, 'title') ? <DefaultAction action={action} key={idx} /> : action
    )

    return (
      <div className='medium-4 columns no-padding'>
        <span className='lead-header_secondary-action'>{actionsList}</span>
      </div>
    )
  } else {
    return null
  }
}

const PageHeader = ({ title, content, action, breadcrumbs, background }) => {
  const hasBreadcrumbs = breadcrumbs.length > 0
  return (
    <header
      className={`lead-header short ${hasBreadcrumbs ? 'has-breadcrumbs' : ''} bg-${background}`}
    >
      <div className='row full-width inner--3x'>
        <div className='large-12 columns'>
          {hasBreadcrumbs && <BreadCrumbs items={breadcrumbs} />}
          <hgroup className='lead-header_group'>
            <h1 className={`lead-header_title ${hasBreadcrumbs ? 'small' : 'small-serif'} c-oil`}>
              {title}
            </h1>
            {content && (
              <div className='medium-8 columns no-padding'>
                <p>{content}</p>
              </div>
            )}
            <Actions actions={action} />
          </hgroup>
        </div>
      </div>
    </header>
  )
}

PageHeader.defaultProps = {
  background: 'vapor',
  breadcrumbs: []
}

PageHeader.propTypes = {
  title: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  action: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  breadcrumbs: PropTypes.array
}

export default PageHeader
