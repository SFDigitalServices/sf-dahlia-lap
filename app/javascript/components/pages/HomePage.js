import React from 'react'

import PageHeader from '../organisms/PageHeader'

const HomePageHeader = ({}) => {
  return (
    <div>
      <PageHeader
        title='Welcome to the Leasing Agent Portal.'
        content='We hope you enjoy your stay here.' />
    </div>
  )
}

const HomePage = ({}) => {
  return (
    <div>
      <HomePageHeader />
    </div>
  )
}

export default HomePage
