import React from 'react'

import classNames from 'classnames'

// import ContentSection from '../molecules/ContentSection'

// <div className="app-card form-card tabs-card max-width expand-on-small">
//   {children}
// </div>

const TabCard = ({ children, padding }) => {
  const sectionClassName = classNames(
    "tabs-card-row",
    "row",
    "full-width",
    "inner--3x",
    "margin-bottom--2x",
    {
      "padding-top--2x": padding
    }
  )
  return (
    <section className={sectionClassName}>
      {children}
    </section>
  )
}

TabCard.defaultProps = {
  padding: false
};

export default TabCard
