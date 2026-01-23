import React, { useState } from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Form } from 'react-final-form'
import { useSearchParams } from 'react-router-dom'

import Button from 'components/atoms/Button'
import Checkbox from 'components/atoms/Checkbox'
import { getLeaseUpApplicationFilters } from 'components/lease_ups/applicationFiltersConsts'
import LeaseUpApplicationsFilters from 'components/lease_ups/LeaseUpApplicationsFilters'
import ButtonDropdown from 'components/molecules/ButtonDropdown'
import Loading from 'components/molecules/Loading'
import ShowHideFiltersButton from 'components/molecules/ShowHideFiltersButton'
import { useAppContext } from 'utils/customHooks'
import SearchField from 'utils/form/final_form/SearchField'
import formUtils from 'utils/formUtils'
import {
  INVITE_APPLY_EMAIL_OPTIONS,
  IsInviteToApplyEnabledForListing
} from 'utils/inviteApplyEmail'

const styles = {
  marginBottomZero: {
    marginBottom: 0
  },
  bulkEditCheckbox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.25rem',
    paddingRight: '1rem'
  }
}

const getNumFiltersApplied = (form, statusOptions) => {
  return getLeaseUpApplicationFilters(statusOptions).filter((f) => {
    const value = form.getState().values[f.fieldName]
    return !(!value || value.length === 0)
  }).length
}

const LeaseUpApplicationsFilterContainer = ({
  listingId,
  listingType,
  onSubmit,
  preferences = [],
  loading = false,
  bulkCheckboxesState = [],
  onBulkLeaseUpStatusChange,
  onBulkLeaseUpCommentChange,
  onRsvpSendEmailChange,
  onClearSelectedApplications = () => {},
  onSelectAllApplications = () => {},
  statusOptions = []
}) => {
  const isInviteApplyEnabled = IsInviteToApplyEnabledForListing(listingId)

  const [isShowingFilters, setIsShowingFilters] = useState(false)
  const [hasChangedFilters, setHasChangedFilters] = useState(false)
  const [, setSearchParams] = useSearchParams()

  const [
    {
      applicationsListData: { appliedFilters }
    }
  ] = useAppContext()

  const onClickShowHideFilters = () => setIsShowingFilters(!isShowingFilters)

  const handleFilterChange = () => {
    setHasChangedFilters(true)
  }

  const handleFormSubmit = (filters, form) => {
    const filterFormState = form.getState()
    const newURLSearchParams = new URLSearchParams()

    for (const filterKey in filterFormState.values) {
      if (filterKey === 'search') {
        const searchValue = filterFormState.values.search
        if (!searchValue) continue
        newURLSearchParams.set('search', searchValue)
        continue
      }

      const formFilterValues = filterFormState.values[filterKey]

      if (!formFilterValues) continue
      formFilterValues.forEach((v) => {
        newURLSearchParams.append(filterKey, v)
      })
    }

    setSearchParams(newURLSearchParams)

    onSubmit(formUtils.scrubEmptyValues(filters, true))
    form.resetFieldState('search')
    setHasChangedFilters(false)
  }

  const handleClearFilters = (form) => {
    getLeaseUpApplicationFilters(statusOptions).forEach((f) => {
      const isChanged = !!form.getState().values[f.fieldName]
      if (isChanged) {
        form.change(f.fieldName, null)
        handleFormSubmit(form.getState().values, form)
      }
    })
  }

  const applicationIds = Object.entries(bulkCheckboxesState)
  const numChecked = applicationIds.filter(([_, checked]) => checked).length
  const allChecked = applicationIds.length > 0 && applicationIds.length === numChecked

  const handleCheckboxClicked = () => {
    if (numChecked > 0) {
      onClearSelectedApplications()
    } else {
      onSelectAllApplications()
    }
  }

  React.useEffect(() => {
    const keys = Object.keys(appliedFilters)
    const filteredKeys = keys.filter((key) => key !== 'search')
    if (filteredKeys.length > 0) {
      setIsShowingFilters(true)
    }
  }, [appliedFilters])

  return (
    <Loading isLoading={loading}>
      <Form
        onSubmit={handleFormSubmit}
        initialValues={appliedFilters}
        render={({ form, handleSubmit }) => (
          <form style={styles.marginBottomZero} onSubmit={handleSubmit} noValidate>
            <div className='filter-row' data-testid='lease-up-applications-filter-container'>
              <div className='filter-group filter-group--left'>
                <div style={styles.bulkEditCheckbox}>
                  <Checkbox
                    id='bulk-edit-controller'
                    indeterminate={!allChecked && numChecked > 0}
                    checked={allChecked}
                    onClick={handleCheckboxClicked}
                  />
                </div>
                <div className='filter-group_action'>
                  <div className='padding-right--half d-inline-block'>
                    <ButtonDropdown
                      classes={{ tertiary: numChecked === 0 }}
                      disabled={numChecked === 0}
                      onChange={onBulkLeaseUpStatusChange}
                      minWidthPx={'185px'}
                      placeholder={'Set Status'}
                      dataTestId={'bulk-status-dropdown'}
                      forceDisplayPlaceholderText
                      tertiary={numChecked === 0}
                      options={statusOptions}
                      classNamePrefix={'status-dropdown'}
                    />
                  </div>
                  <div className='padding-right--half d-inline-block'>
                    <Button
                      tertiary={numChecked === 0}
                      disabled={numChecked === 0}
                      onClick={onBulkLeaseUpCommentChange}
                      type='button'
                      minWidthPx='185px'
                      text='Add Comment'
                      textAlign='left'
                      noBottomMargin
                    />
                  </div>
                  {isInviteApplyEnabled && (
                    <div className='padding-right--half d-inline-block'>
                      <ButtonDropdown
                        classes={{ tertiary: numChecked === 0 }}
                        disabled={numChecked === 0}
                        onChange={onRsvpSendEmailChange}
                        minWidthPx={'185px'}
                        placeholder={'Send Email'}
                        dataTestId={'bulk-email-dropdown'}
                        forceDisplayPlaceholderText
                        tertiary={numChecked === 0}
                        options={INVITE_APPLY_EMAIL_OPTIONS}
                        classNamePrefix={'rsvp-dropdown'}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className='filter-group'>
                <div className='filter-group_item__large'>
                  <SearchField
                    onClearClick={() => {
                      form.change('search', '')
                      form.submit()
                    }}
                    fieldName='search'
                    id='test-search'
                    placeholder='Application, First Name, Last Name...'
                    minWidth='300px'
                  />
                </div>
                <div className='filter-group_action'>
                  <Button
                    className={classNames('primary', {
                      'tertiary-inverse': !form.getFieldState('search')?.modified
                    })}
                    text='Search'
                    type='submit'
                  />
                </div>
                <div className='filter-group_action'>
                  <ShowHideFiltersButton
                    isShowingFilters={isShowingFilters}
                    onClick={onClickShowHideFilters}
                    numFiltersApplied={getNumFiltersApplied(form)}
                  />
                </div>
              </div>
            </div>
            {isShowingFilters && (
              <LeaseUpApplicationsFilters
                listingType={listingType}
                preferences={preferences}
                hasChangedFilters={hasChangedFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => handleClearFilters(form)}
                statusOptions={statusOptions}
              />
            )}
          </form>
        )}
      />
    </Loading>
  )
}

LeaseUpApplicationsFilterContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onBulkLeaseUpStatusChange: PropTypes.func.isRequired,
  onBulkLeaseUpCommentChange: PropTypes.func.isRequired,
  onClearSelectedApplications: PropTypes.func,
  onSelectAllApplications: PropTypes.func,
  preferences: PropTypes.array,
  loading: PropTypes.bool,
  bulkActionApplications: PropTypes.object,
  statusOptions: PropTypes.array
}

export default LeaseUpApplicationsFilterContainer
