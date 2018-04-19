import React from 'react'

const PageHeader = ({ title, content }) => {
  return (
    <div className='page-header'>
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  )
}

export default PageHeader
