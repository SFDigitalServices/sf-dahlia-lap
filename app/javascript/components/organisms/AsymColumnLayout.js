import React from 'react'

import classNames from 'classnames'

const AsymColumnLayout = {}

AsymColumnLayout.Container = ({ children }) => {
  const styles = {
    maxWidth: '80rem',
    display: 'flex',
    alignItems: 'stretch',
    flexWrap: 'wrap'
  }

  return (
    <div style={styles}>
      {children}
    </div>
  )
}

AsymColumnLayout.MainContent = ({ children }) => {
  const classes = classNames(
    'medium-12',
    'large-8',
    'columns',
    'page-content-column'
  )
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

AsymColumnLayout.Sidebar = ({ children }) => {
  const classes = classNames(
    'medium-12',
    'large-4',
    'columns',
    'sidebar-column'
  )
  return (
    <div className={classes}>
      {children}
    </div>
  )
}

export default AsymColumnLayout
