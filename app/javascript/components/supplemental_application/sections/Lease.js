import React from 'react'
import { filter, map, isEmpty } from 'lodash'

import Button from '~/components/atoms/Button'
import ContentSection from '~/components/molecules/ContentSection'
import FormGrid from '~/components/molecules/FormGrid'
import InlineModal from '~/components/molecules/InlineModal'
import formUtils from '~/utils/formUtils'
import ParkingInformationInputs from './ParkingInformationInputs'
import RentalAssistance from './RentalAssistance'
import { convertPercentAndCurrency } from '../../../utils/form/validations'

import { pluck } from '~/utils/utils'
import { withContext } from '../context'
import { CurrencyField, Label, SelectField } from '~/utils/form/final_form/Field.js'
import { MultiDateField } from '~/utils/form/final_form/MultiDateField'
import { validateLeaseCurrency } from '~/utils/form/validations'
import { EDIT_LEASE_STATE } from '../SupplementalApplicationPage'
import { doesApplicationHaveLease } from '~/utils/leaseUtils'

const toggleNoPreferenceUsed = (form, event) => {
  // lease.preference_used need to be reset, otherwise SF validation fails
  if (isEmpty(event.target.value)) {
    form.change('lease.preference_used', '')
  }
  form.change('lease.no_preference_used', isEmpty(event.target.value))
}
const LeaseActions = ({
  onEditLeaseClick,
  onSave,
  onCancelLeaseClick,
  onDelete,
  leaseExists,
  loading,
  isEditing
}) => {
  if (!isEditing) {
    return (
      <div className='form-grid_item column'>
        <Button
          id='edit-lease-button'
          classes='secondary'
          small
          onClick={onEditLeaseClick}
          disabled={loading}
          noBottomMargin
          text='Edit Lease'
        />
      </div>
    )
  }

  return (
    <div className='form-grid_item column'>
      <Button
        classes='primary margin-right'
        small
        onClick={onSave}
        disabled={loading}
        noBottomMargin
        text='Save Lease'
      />
      <Button
        classes='secondary'
        small
        onClick={onCancelLeaseClick}
        disabled={loading}
        noBottomMargin
        text='Cancel'
      />
      {leaseExists && (
        <Button
          classes='alert-fill right'
          small
          onClick={onDelete}
          disabled={loading}
          noBottomMargin
          text='Delete'
        />
      )}
    </div>
  )
}

const Lease = ({ form, submitting, values, store }) => {
  const {
    availableUnits,
    application,
    handleSaveLease,
    handleDeleteLease,
    handleEditLeaseClick,
    handleCancelLeaseClick,
    leaseSectionState,
    loading
  } = store

  const isEditingMode = leaseSectionState === EDIT_LEASE_STATE
  const disabled = !isEditingMode

  const availableUnitsOptions = formUtils.toOptions(
    map(availableUnits, pluck('id', 'unit_number'))
  )

  const noUnitsOptions = [{ value: '', label: 'No Units Available' }]
  const confirmedPreferences = filter(application.preferences, {
    post_lottery_validation: 'Confirmed'
  })

  const confirmedPreferenceOptions = formUtils.toOptions(
    map(
      [{ id: null, preference_name: 'None' }, ...confirmedPreferences],
      pluck('id', 'preference_name')
    )
  )

  const getVisited = (fieldName) => (
    form.getFieldState(fieldName)?.visited
  )

  const areNoUnitsAvailable = !availableUnitsOptions.length

  return (
    <InlineModal>
      <ContentSection.Header description='If the household receives recurring rental assistance, remember to subtract this from the unit’s rent when calculating Tenant Contribution.' />
      <ContentSection.Sub title='Unit and Parking'>
        <FormGrid.Row>
          <FormGrid.Item>
            <SelectField
              id='lease_assigned_unit'
              label='Assigned Unit Number'
              fieldName='lease.unit'
              options={availableUnitsOptions}
              disabled={disabled || areNoUnitsAvailable}
              disabledOptions={areNoUnitsAvailable && noUnitsOptions}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <ParkingInformationInputs
          form={form}
          values={values}
          disabled={disabled}
        />
      </ContentSection.Sub>
      <ContentSection.Sub
        title='Rent and Assistance'
      >
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              label='Monthly Rent'
              fieldName='lease.total_monthly_rent_without_parking'
              validation={validateLeaseCurrency}
              isDirty={
                getVisited('lease.total_monthly_rent_without_parking')
              }
              disabled={disabled}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <Label label='Rental Assistance' />
          </FormGrid.Item>
        </FormGrid.Row>
        <RentalAssistance
          form={form}
          submitting={submitting}
          disabled={disabled}
        />
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              label='Tenant Contribution'
              fieldName='lease.monthly_tenant_contribution'
              helpText='Monthly rent minus recurring rental assistance, if any'
              validation={validateLeaseCurrency}
              isDirty={getVisited('lease.monthly_tenant_contribution')}
              disabled={disabled}
            />
          </FormGrid.Item>
        </FormGrid.Row>
      </ContentSection.Sub>
      <ContentSection.Sub title='Lease Details'>
        <FormGrid.Row>
          <FormGrid.Item>
            <MultiDateField
              id='lease_start_date'
              fieldName='lease.lease_start_date'
              form={form}
              label='Lease Start Date'
              disabled={disabled}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <SelectField
              label='Preference Used'
              onChange={value => toggleNoPreferenceUsed(form, value)}
              fieldName='lease.preference_used'
              options={confirmedPreferenceOptions}
              disabled={disabled}
            />
          </FormGrid.Item>
        </FormGrid.Row>
      </ContentSection.Sub>
      <FormGrid.Row>
        {/* TODO: Wire up actions for buttons, set to disabled when loading */}
        <LeaseActions
          onSave={() => handleSaveLease(convertPercentAndCurrency(form.getState().values))}
          onCancelLeaseClick={handleCancelLeaseClick}
          onEditLeaseClick={handleEditLeaseClick}
          onDelete={handleDeleteLease}
          loading={loading}
          leaseExists={doesApplicationHaveLease(application)}
          isEditing={isEditingMode}
        />
      </FormGrid.Row>
    </InlineModal>
  )
}

export default withContext(Lease)