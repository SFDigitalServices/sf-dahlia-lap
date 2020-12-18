import React, { useContext, useState } from 'react'

import { useParams } from 'react-router-dom'

import Alerts from 'components/Alerts'
import ApplicationPage2 from 'components/applications/ApplicationPage2'
import CardLayout from 'components/layouts/CardLayout'
import { getShortFormApplication } from 'components/lease_ups/shortFormActions'
import Loading from 'components/molecules/Loading'
import { getPageHeaderData } from 'components/supplemental_application/leaseUpApplicationBreadcrumbs'
import SupplementalApplicationContainer from 'components/supplemental_application/SupplementalApplicationContainer'
import { AppContext } from 'context/Provider'
import { useAsyncOnMount } from 'utils/customHooks'

const SUPP_TAB_KEY = 'supplemental_tab'
const SHORTFORM_TAB_KEY = 'shortform_tab'

const ApplicationDetailsContainer = () => {
  const { applicationId } = useParams()
  const [selectedTabKey, setSelectedTabKey] = useState(SUPP_TAB_KEY)
  const [
    {
      breadcrumbData,
      applicationDetailsData: { supplemental, shortform }
    },
    actions
  ] = useContext(AppContext)

  const [loadingShortform, setLoadingShortform] = useState(true)

  useAsyncOnMount(() => getShortFormApplication(applicationId), {
    onSuccess: ({ application, fileBaseUrl }) => {
      actions.applicationPageLoadComplete(application, application?.listing, fileBaseUrl)
    },
    onComplete: () => {
      setLoadingShortform(false)
    }
  })

  useAsyncOnMount(
    () => {
      if (supplemental.application?.id) return null

      return actions.loadSupplementalPageData(applicationId, breadcrumbData?.listingId?.id)
    },
    {
      onFail: (e) => {
        console.error(e)
        Alerts.error()
      }
    }
  )

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

  const loadingCurrentTab =
    selectedTabKey === SUPP_TAB_KEY ? supplemental.loading : loadingShortform

  return (
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
          supplemental.application && <SupplementalApplicationContainer />
        ) : (
          <ApplicationPage2
            application={shortform.application}
            fileBaseUrl={shortform.fileBaseUrl}
          />
        )}
      </Loading>
    </CardLayout>
  )
}

export default ApplicationDetailsContainer
