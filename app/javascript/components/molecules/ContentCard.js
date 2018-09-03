import React from 'react'

const ContentCard = ({ title, description }) => {
  return (
    <div className='content-card bg-dust'>
      <h4 className='t-sans t-base t-bold margin-bottom--half'>
        <a href='#'>
          {title}
          <span className='ui-icon ui-small i-primary'>
            <svg>
              <use xlinkHref='#i-arrow-right' />
            </svg>
          </span>
        </a>
      </h4>
      <p>{description}</p>
    </div>
  )
}

export default ContentCard
