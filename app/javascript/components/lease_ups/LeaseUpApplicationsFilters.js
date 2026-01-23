import React from 'react'

import classNames from 'classnames'

import Button from 'components/atoms/Button'
import { COLORS } from 'components/atoms/colors'
import { getLeaseUpApplicationFilters } from 'components/lease_ups/applicationFiltersConsts'
import FormGrid from 'components/molecules/FormGrid'
import MultiSelectField from 'utils/form/final_form/MultiSelectField'

import { LISTING_TYPE_FIRST_COME_FIRST_SERVED } from '../../utils/consts'

const styles = {
  containerEndJustified: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  whiteSmokeBackground: {
    background: COLORS.snow
  }
}

const LeaseUpApplicationsFilters = ({
  listingType,
  listingId,
  preferences = [],
  hasChangedFilters,
  onFilterChange = () => {},
  onClearFilters = () => {},
  statusOptions
}) => {
  const renderFilter = (filter) => (
    <FormGrid.Item width='25%' key={filter.fieldName}>
      <MultiSelectField
        options={filter.getOptions({ listingPreferences: preferences })}
        fieldName={filter.fieldName}
        label={filter.label}
        placeholder={filter.placeholder}
        onChange={onFilterChange}
      />
    </FormGrid.Item>
  )

  // only include preferences filter if the Listing Type is not first come first served
  const includePreferencesFilter = listingType !== LISTING_TYPE_FIRST_COME_FIRST_SERVED
  const filters = includePreferencesFilter
    ? getLeaseUpApplicationFilters(listingId, statusOptions)
    : getLeaseUpApplicationFilters(listingId, statusOptions, false)

  return (
    <div className='padding-top--2x padding-left padding-right' style={styles.whiteSmokeBackground}>
      <FormGrid.Row expand paddingBottom>
        {filters.map((f) => renderFilter(f))}
      </FormGrid.Row>

      <div className='small-12 margin-top' style={styles.containerEndJustified}>
        <Button
          type='submit'
          classes={classNames('margin-right--half', {
            'tertiary-inverse': !hasChangedFilters,
            primary: hasChangedFilters
          })}
          paddingHorizontal='extra'
          text='Apply filters'
        />
        <Button
          classes='tertiary'
          paddingHorizontal='extra'
          text='Clear all'
          onClick={onClearFilters}
        />
      </div>
    </div>
  )
}
export default LeaseUpApplicationsFilters
