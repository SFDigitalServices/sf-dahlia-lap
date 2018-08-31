import React from 'react'
import ContentCard from '../molecules/ContentCard'

const ContentCardGrid = ({ title, description }) => {
  return (
    <ul className='content-grid wide-grid-margins'>
      <li className='content-item'>
        <ContentCard title={title} description={description} />
      </li>
      <li className='content-item'>
        <ContentCard title={title} description={description} />
      </li>
    </ul>
  )
}

export default ContentCardGrid
