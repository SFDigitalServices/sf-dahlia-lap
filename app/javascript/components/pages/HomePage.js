import React from 'react'

import ErrorBoundary from 'components/atoms/ErrorBoundary'

import PageHeader from '../organisms/PageHeader'

const ErrorTest = () => {
  throw new Error('error test')
}

const HomePageHeader = () => (
  <ErrorBoundary>
    <ErrorTest />
    <PageHeader title='Welcome to DAHLIA Partners.' content='We hope you enjoy your stay here.' />
  </ErrorBoundary>
)

const HomePage = () => <HomePageHeader />

export default HomePage
