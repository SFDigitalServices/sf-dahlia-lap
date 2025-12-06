import React, { useState } from 'react'

import arrayMutators from 'final-form-arrays'
import { isEmpty } from 'lodash'
import { Form } from 'react-final-form'
import { useParams } from 'react-router-dom'

import Alerts from 'components/Alerts'
import { applicationPageLoadComplete } from 'components/applications/actions/applicationActionCreators'
import ApplicationDetails from 'components/applications/application_details/ApplicationDetails'
import CardLayout from 'components/layouts/CardLayout'
import { getShortFormApplication } from 'components/lease_ups/utils/shortFormRequestUtils'
import Loading from 'components/molecules/Loading'
import {
  loadSupplementalPageData,
  updateSupplementalApplication
} from 'components/supplemental_application/actions/supplementalApplicationActionCreators'
import { getPageHeaderData } from 'components/supplemental_application/leaseUpApplicationBreadcrumbs'
import SupplementalApplicationContainer from 'components/supplemental_application/SupplementalApplicationContainer'
import { useAppContext, useAsyncOnMount } from 'utils/customHooks'
import validate, { convertPercentAndCurrency } from 'utils/form/validations'

import labelMapperFields from '../applications/application_details/applicationDetailsFieldsDesc'

const SUPP_TAB_KEY = 'supplemental_tab'
const SHORTFORM_TAB_KEY = 'shortform_tab'

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

  const [loadingShortform, setLoadingShortform] = useState(true)

  useAsyncOnMount(() => getShortFormApplication(applicationId), {
    onSuccess: ({ application, fileBaseUrl }) => {
      applicationPageLoadComplete(dispatch, application, fileBaseUrl)
    },
    onComplete: () => {
      setLoadingShortform(false)
    }
  })

  useAsyncOnMount(() =>
    loadSupplementalPageData(dispatch, applicationId, breadcrumbData?.listingId?.id)
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

  const performingInitialLoadForTab =
    selectedTabKey === SUPP_TAB_KEY ? !supplemental.application : loadingShortform

  const renderShortform = () => {
    if (loadingShortform) {
      return null
    } else if (!shortform.application && !loadingShortform) {
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

  return (
    <CardLayout
      pageHeader={getPageHeaderData(breadcrumbData.application, breadcrumbData.listing)}
      tabSection={{ items: tabItems }}
    >
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
