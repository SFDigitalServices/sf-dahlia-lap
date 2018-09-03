import React from 'react'

import PageHeader from '../organisms/PageHeader'

const HomePageHeader = ({ header }) => {
  return (
    <div>
      <PageHeader
        title='Welcome to the Leasing Agent Portal.'
        content='We hope you enjoy your stay here.' />
    </div>
  )
}

const HomePage = ({ page }) => {
  return (
    <div>
      <HomePageHeader />
    </div>
  )
}

export default HomePage
