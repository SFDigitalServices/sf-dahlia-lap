import React, { useState, useEffect } from 'react'

import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'
import { Form } from 'react-final-form'
import { useParams } from 'react-router-dom'

import Alerts from 'components/Alerts'
import { applicationPageLoadComplete } from 'components/applications/actions/applicationActionCreators'
import ApplicationDetails from 'components/applications/application_details/ApplicationDetails'
import RefreshIndicator from 'components/atoms/RefreshIndicator'
import CardLayout from 'components/layouts/CardLayout'
import { getSupplementalBreadcrumbData } from 'components/lease_ups/actions/breadcrumbActionHelpers'
import Loading from 'components/molecules/Loading'
import { updateSupplementalApplication } from 'components/supplemental_application/actions/supplementalApplicationActionCreators'
import { getPageHeaderData } from 'components/supplemental_application/leaseUpApplicationBreadcrumbs'
import SupplementalApplicationContainer from 'components/supplemental_application/SupplementalApplicationContainer'
import ACTIONS from 'context/actions'
import { useShortFormApplication, useSupplementalPageData } from 'query/hooks'
import { useAppContext } from 'utils/customHooks'
import validate, { convertPercentAndCurrency } from 'utils/form/validations'

import labelMapperFields from '../applications/application_details/applicationDetailsFieldsDesc'

const SUPP_TAB_KEY = 'supplemental_tab'
const SHORTFORM_TAB_KEY = 'shortform_tab'

/**
 * Error message component with retry option
 */
const ErrorMessage = ({ message, onRetry }) => (
  <div className='padding-top--2x text-center'>
    <p className='c-alert'>{message}</p>
    {onRetry && (
      <button type='button' className='button primary small' onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
)

/**
 * Supplemental application page with both supplemental and shortform tabs
 */
const SupplementalApplicationPage = () => {
  const { applicationId } = useParams()
  const [selectedTabKey, setSelectedTabKey] = useState(SUPP_TAB_KEY)
  const [
    {
      breadcrumbData,
      supplementalApplicationData: { supplemental, shortform }
    },
    dispatch
  ] = useAppContext()

  // Fetch shortform application data using TanStack Query
  const {
    application: shortformApplication,
    fileBaseUrl: shortformFileBaseUrl,
    isLoading: isShortformLoading,
    isFetching: isShortformFetching,
    isError: isShortformError,
    refetch: refetchShortform
  } = useShortFormApplication(applicationId)

  // Fetch supplemental page data using TanStack Query
  const {
    pageData: supplementalPageData,
    application: supplementalApplication,
    listing: supplementalListing,
    isLoading: isSupplementalLoading,
    isFetching: isSupplementalFetching,
    isError: isSupplementalError,
    refetch: refetchSupplemental
  } = useSupplementalPageData(applicationId, breadcrumbData?.listing?.id)

  // Update context when shortform data loads
  useEffect(() => {
    if (shortformApplication && shortformFileBaseUrl !== undefined) {
      applicationPageLoadComplete(dispatch, shortformApplication, shortformFileBaseUrl)
    }
  }, [shortformApplication, shortformFileBaseUrl, dispatch])

  // Update context when supplemental data loads
  useEffect(() => {
    if (supplementalPageData && supplementalApplication && supplementalListing) {
      dispatch({
        type: ACTIONS.SUPP_APP_INITIAL_LOAD_SUCCESS,
        data: {
          breadcrumbData: getSupplementalBreadcrumbData(
            supplementalApplication,
            supplementalListing
          ),
          pageData: supplementalPageData
        }
      })
    }
  }, [supplementalPageData, supplementalApplication, supplementalListing, dispatch])

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

  const handleSaveApplication = async (formApplication) => {
    const { application: prevApplication, leaseSectionState } = supplemental

    return updateSupplementalApplication(
      dispatch,
      leaseSectionState,
      formApplication,
      prevApplication
    ).catch((e) => {
      console.error(e)
      Alerts.error()
    })
  }

  // Determine loading state for each tab
  // Use isLoading for initial load (no cached data), not isFetching (background refetch)
  // For the supplemental tab, also check if context has the application
  // (since we dispatch to context and the form uses context data)
  const performingInitialLoadForTab =
    selectedTabKey === SUPP_TAB_KEY
      ? isSupplementalLoading || !supplemental.application
      : isShortformLoading

  // Background refetch indicator - show when fetching but not initial load
  const isBackgroundRefetching =
    selectedTabKey === SUPP_TAB_KEY
      ? isSupplementalFetching && !isSupplementalLoading && supplemental.application
      : isShortformFetching && !isShortformLoading && shortform.application

  const renderShortform = () => {
    if (isShortformLoading) {
      return null
    }

    if (isShortformError) {
      return (
        <ErrorMessage
          message='An error occurred while loading the shortform application.'
          onRetry={refetchShortform}
        />
      )
    }

    if (!shortform.application && !isShortformLoading) {
      return 'The requested shortform snapshot could not be found.'
    }

    return (
      <ApplicationDetails
        application={shortform.application}
        fileBaseUrl={shortform.fileBaseUrl}
        fields={labelMapperFields}
      />
    )
  }

  // Render error state for supplemental tab
  if (selectedTabKey === SUPP_TAB_KEY && isSupplementalError && !supplemental.application) {
    return (
      <CardLayout
        pageHeader={getPageHeaderData(breadcrumbData.application, breadcrumbData.listing)}
        tabSection={{ items: tabItems }}
      >
        <ErrorMessage
          message='An error occurred while loading the application. Please try again.'
          onRetry={refetchSupplemental}
        />
      </CardLayout>
    )
  }

  return (
    <CardLayout
      pageHeader={getPageHeaderData(breadcrumbData.application, breadcrumbData.listing)}
      tabSection={{ items: tabItems }}
    >
      {/* Subtle background refetch indicator */}
      {isBackgroundRefetching && (
        <div className='text-right padding-right--2x padding-bottom--half'>
          <RefreshIndicator />
        </div>
      )}
      <Loading
        isLoading={performingInitialLoadForTab}
        renderChildrenWhileLoading={false}
        loaderViewHeight='100vh'
      >
        <WrappedWithSuppAppForm
          onSubmit={handleSaveApplication}
          applicationSinceLastSave={supplemental.application}
          render={({ handleSubmit, form, touched, values, visited }) =>
            selectedTabKey === SUPP_TAB_KEY ? (
              <SupplementalApplicationContainer
                handleSubmit={handleSubmit}
                form={form}
                touched={touched}
                values={values}
                visited={visited}
                listingId={shortform?.application?.listing_id}
              />
            ) : (
              renderShortform()
            )
          }
        />
      </Loading>
    </CardLayout>
  )
}

// We need to do this outside of the SupplementalApplicationController component
// so the form fields don't get cleared out
// when the child component is unmounted on tab switch.
const WrappedWithSuppAppForm = ({ onSubmit, applicationSinceLastSave, render }) => {
  const validateForm = (values) => {
    const errors = { lease: {} }
    // only validate lease_start_date when any of the fields is present
    if (!isEmpty(values.lease) && !isEmpty(values.lease.lease_start_date)) {
      const dateErrors = validate.isValidDate(values.lease.lease_start_date, {})

      // only set any error fields if there were actually any date errors.
      if (dateErrors?.all || dateErrors?.day || dateErrors?.month || dateErrors?.year) {
        errors.lease.lease_start_date = dateErrors
      }
    }
    if (!isEmpty(values.supp_app_signed_date)) {
      const dateErrors = validate.isValidDate(values.supp_app_signed_date, {})

      // only set any error fields if there were actually any date errors.
      if (dateErrors?.all || dateErrors?.day || dateErrors?.month || dateErrors?.year) {
        errors.supp_app_signed_date = dateErrors
      }
    }
    return errors
  }

  return (
    <Form
      onSubmit={(values) => onSubmit(convertPercentAndCurrency(values))}
      initialValues={applicationSinceLastSave}
      // Keep dirty on reinitialize ensures the whole form doesn't refresh
      // when only a piece of it is saved (eg. when the lease is saved)
      keepDirtyOnReinitialize
      validate={validateForm}
      mutators={{ ...arrayMutators }}
      render={render}
    />
  )
}

export default SupplementalApplicationPage
