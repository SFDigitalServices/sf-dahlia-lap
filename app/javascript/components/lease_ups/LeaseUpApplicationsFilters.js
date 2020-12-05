import React from 'react'

import classNames from 'classnames'

import Button from 'components/atoms/Button'
import { COLORS } from 'components/atoms/colors'
import { LEASE_UP_APPLICATION_FILTERS } from 'components/lease_ups/applicationFiltersConsts'
import FormGrid from 'components/molecules/FormGrid'
import MultiSelectField from 'utils/form/final_form/MultiSelectField'

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
  preferences = [],
  hasChangedFilters,
  onFilterChange = () => {},
  onClearFilters = () => {}
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

  return (
    <div className='padding-top--2x padding-left padding-right' style={styles.whiteSmokeBackground}>
      <FormGrid.Row expand paddingBottom>
        {LEASE_UP_APPLICATION_FILTERS.map((f) => renderFilter(f))}
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
