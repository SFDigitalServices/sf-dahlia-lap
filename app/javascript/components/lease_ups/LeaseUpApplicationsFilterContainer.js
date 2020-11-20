import React, { useState } from 'react'

import classNames from 'classnames'
import { Form } from 'react-final-form'

import Button from 'components/atoms/Button'
import UnlabeledCheckbox from 'components/atoms/UnlabeledCheckbox'
import { LEASE_UP_APPLICATION_FILTERS } from 'components/lease_ups/applicationFiltersConsts'
import LeaseUpApplicationsFilters from 'components/lease_ups/LeaseUpApplicationsFilters'
import Loading from 'components/molecules/Loading'
import ShowHideFiltersButton from 'components/molecules/ShowHideFiltersButton'
import StatusDropdown from 'components/molecules/StatusDropdown'
import SearchField from 'utils/form/final_form/SearchField'
import formUtils from 'utils/formUtils'

const styles = {
  marginBottomZero: {
    marginBottom: 0
  }
}

const getNumFiltersApplied = (form) =>
  LEASE_UP_APPLICATION_FILTERS.filter((f) => !!form.getState().values[f.fieldName]).length

const LeaseUpApplicationsFilterContainer = ({ onSubmit, preferences = [], loading = false }) => {
  const [isShowingFilters, setIsShowingFilters] = useState(false)
  const [hasChangedFilters, setHasChangedFilters] = useState(false)

  const onClickShowHideFilters = () => setIsShowingFilters(!isShowingFilters)

  const handleFilterChange = () => {
    setHasChangedFilters(true)
  }

  const handleFormSubmit = (filters, form) => {
    onSubmit(formUtils.scrubEmptyValues(filters, true))
    form.resetFieldState('search')
    setHasChangedFilters(false)
  }

  const handleClearFilters = (form) => {
    LEASE_UP_APPLICATION_FILTERS.forEach((f) => {
      const isChanged = !!form.getState().values[f.fieldName]
      if (isChanged) {
        form.change(f.fieldName, null)
        setHasChangedFilters(true)
      }
    })
  }

  return (
    <Loading isLoading={loading}>
      <Form
        onSubmit={handleFormSubmit}
        render={({ form, handleSubmit }) => (
          <form style={styles.marginBottomZero} onSubmit={handleSubmit} noValidate>
            <div className='filter-row'>
              <div className='filter-group filter-group--left'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.25rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}
                >
                  <UnlabeledCheckbox id={'bulk-edit-controller'} />
                </div>
                <div className='filter-group_action'>
                  <StatusDropdown
                    onChange={() => console.log('on status dropdown change')}
                    minWidthPx={'185px'}
                  />
                </div>
              </div>
              <div className='filter-group'>
                <div className='filter-group_item__large'>
                  <SearchField
                    onClearClick={() => form.change('search', '')}
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
                form={form}
                preferences={preferences}
                hasChangedFilters={hasChangedFilters}
                onFilterChange={handleFilterChange}
                onClearFilters={() => handleClearFilters(form)}
              />
            )}
          </form>
        )}
      />
    </Loading>
  )
}

export default LeaseUpApplicationsFilterContainer
