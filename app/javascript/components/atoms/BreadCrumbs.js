import React from 'react'

const BreadCrumbs = ({ item, item_2, item_3 }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol class="breadcrumbs">
        <li><a href="#">{item}</a></li>
        <li><a href="#">{item_2}</a></li>
        <li class="current"><a href="#" aria-current="page">{item_3}</a></li>
      </ol>
    </nav>
  )
}

export default BreadCrumbs
