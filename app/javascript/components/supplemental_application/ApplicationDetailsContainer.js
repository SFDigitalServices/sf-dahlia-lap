import React, { useContext, useState } from 'react'

import { useParams } from 'react-router-dom'

import ApplicationPage2 from 'components/applications/ApplicationPage2'
import CardLayout from 'components/layouts/CardLayout'
import { getShortFormApplication } from 'components/lease_ups/shortFormActions'
import Loading from 'components/molecules/Loading'
import { getPageHeaderData } from 'components/supplemental_application/leaseUpApplicationBreadcrumbs'
import SupplementalApplicationPage2 from 'components/supplemental_application/SupplementalApplicationPage2'
import { AppContext } from 'context/Provider'
import { useAsyncOnMount } from 'utils/customHooks'

import Context from './context'

const SUPP_TAB_KEY = 'supplemental_tab'
const SHORTFORM_TAB_KEY = 'shortform_tab'

const ApplicationDetailsContainer = () => {
  const { applicationId } = useParams()
  const [selectedTabKey, setSelectedTabKey] = useState(SUPP_TAB_KEY)
  const [{ breadcrumbData, applicationDetailsData }, actions] = useContext(AppContext)
  const [loadingShortform, setLoadingShortform] = useState(true)
  const [loadingSuppApp, setLoadingSuppApp] = useState(true)

  useAsyncOnMount(() => getShortFormApplication(applicationId), {
    onSuccess: ({ application, fileBaseUrl }) => {
      actions.applicationPageLoadComplete(application, application?.listing, fileBaseUrl)
    },
    onFail: (e) => {
      // Alert window pauses state updates so we set loading to false instead of
      // waiting for the onComplete block
      setLoadingShortform(false)
      window.alert('The application you requested could not be found.')
    },
    onComplete: () => {
      setLoadingShortform(false)
      setLoadingSuppApp(false)
    }
  })

  console.log(selectedTabKey)

  const tabItems = [
    {
      title: 'Supplemental Information',
      active: selectedTabKey === SUPP_TAB_KEY,
      onClick: () => setSelectedTabKey(SUPP_TAB_KEY),
      renderAsRouterLink: true
    },
    {
      title: 'Short Form Application',
      active: selectedTabKey === SHORTFORM_TAB_KEY,
      onClick: () => setSelectedTabKey(SHORTFORM_TAB_KEY),
      renderAsRouterLink: true
    }
  ]

  const loadingCurrentTab = selectedTabKey === SUPP_TAB_KEY ? loadingSuppApp : loadingShortform

  return (
    <Context.Provider value={null}>
      <CardLayout
        pageHeader={getPageHeaderData(breadcrumbData.application, breadcrumbData.listing)}
        tabSection={{ items: tabItems }}
      >
        <Loading
          isLoading={loadingCurrentTab}
          renderChildrenWhileLoading={false}
          loaderViewHeight='100vh'
        >
          {selectedTabKey === SUPP_TAB_KEY ? (
            <SupplementalApplicationPage2
              application={applicationDetailsData.shortform.application}
              fileBaseUrl={applicationDetailsData.shortform.fileBaseUrl}
            />
          ) : (
            <ApplicationPage2
              application={applicationDetailsData.shortform.application}
              fileBaseUrl={applicationDetailsData.shortform.fileBaseUrl}
            />
          )}
        </Loading>
      </CardLayout>
    </Context.Provider>
  )
}

export default ApplicationDetailsContainer
