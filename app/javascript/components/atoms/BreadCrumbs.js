import React from 'react'

const BreadCrumbs = ({ item, item_2, item_3 }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumbs">
        <li><a href="#">{item}</a></li>
        <li><a href="#">{item_2}</a></li>
        <li className="current"><a href="#" aria-current="page">{item_3}</a></li>
      </ol>
    </nav>
  )
}

export default BreadCrumbs
