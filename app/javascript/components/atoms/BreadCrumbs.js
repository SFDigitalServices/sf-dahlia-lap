import React from 'react'

const BreadCrumbs = ({ item, itemA, itemB }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumbs">
        <li><a href="#">{item}</a></li>
        <li><a href="#">{itemA}</a></li>
        <li className="current"><a href="#" aria-current="page">{itemB}</a></li>
      </ol>
    </nav>
  )
}

export default BreadCrumbs
