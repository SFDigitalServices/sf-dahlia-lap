import React from 'react'
import BreadCrumbs from '../atoms/BreadCrumbs'

const PageHeader = ({ title, content, action, item, itemA, itemB }) => {
  return (
    <header className="lead-header short has-breadcrumbs bg-dust">
      <div className="row full-width inner--3x">
        <div className="large-12 columns">
          <BreadCrumbs item={item} itemA={itemA} itemB={itemB}/>
          <hgroup className="lead-header_group">
            <h1 className="lead-header_title small c-oil">{title}</h1>
            <div className="medium-8 columns no-padding">
              <p>{content}</p>
            </div>
            <div className="medium-4 columns no-padding">
              <span className="lead-header_secondary-action"><a href="#" class="alt-caps">{action}</a></span>
            </div>
          </hgroup>
        </div>
      </div>
    </header>
  )
}

export default PageHeader
