import React from 'react'
import BreadCrumbs from '../atoms/BreadCrumbs'

const PageHeader = ({ title, content, action }) => {
  return (
    <header class="lead-header short has-breadcrumbs bg-dust">
      <div class="row full-width inner--3x">
        <div class="large-12 columns">
          <BreadCrumbs/>
          <hgroup class="lead-header_group">
            <h1 class="lead-header_title small c-oil">{title}</h1>
            <div class="medium-8 columns no-padding">
              <p>{content}</p>
            </div>
            <div class="medium-4 columns no-padding">
              <span class="lead-header_secondary-action"><a href="#" class="alt-caps">{action}</a></span>
            </div>
          </hgroup>
        </div>
      </div>
    </header>
  )
}

export default PageHeader
