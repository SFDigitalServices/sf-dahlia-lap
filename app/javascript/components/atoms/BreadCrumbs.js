import React from 'react'

const BreadCrumbs = ({ alpha, beta, gamma }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol class="breadcrumbs">
        <li><a href="#">{alpha}</a></li>
        <li><a href="#">{beta}</a></li>
        <li class="current"><a href="#" aria-current="page">{gamma}</a></li>
      </ol>
    </nav>
  )
}

export default BreadCrumbs
