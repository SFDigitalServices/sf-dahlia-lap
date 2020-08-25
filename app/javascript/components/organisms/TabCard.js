import React from 'react'

import classNames from 'classnames'

const TabCard = ({ children, padding }) => {
  const sectionClassName = classNames(
    'tabs-card-row',
    'row',
    'full-width',
    'inner--3x',
    'margin-bottom--2x',
    {
      'padding-top--2x': padding
    },
    `bg-white`
  )
  return (
    <section className={sectionClassName}>
      {children}
    </section>
  )
}

TabCard.defaultProps = {
  padding: false
}

export default TabCard
