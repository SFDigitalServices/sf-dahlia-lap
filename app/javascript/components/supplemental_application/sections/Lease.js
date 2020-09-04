import React from 'react'
import { filter, map, isEmpty } from 'lodash'

import Button from '~/components/atoms/Button'
import ContentSection from '~/components/molecules/ContentSection'
import FormGrid from '~/components/molecules/FormGrid'
import InlineModal from '~/components/molecules/InlineModal'
import formUtils from '~/utils/formUtils'
import ParkingInformationInputs from './ParkingInformationInputs'
import RentalAssistance from './RentalAssistance'

import { pluck } from '~/utils/utils'
import { withContext } from '../context'
import { CurrencyField, Label, SelectField } from '~/utils/form/final_form/Field.js'
import { MultiDateField } from '~/utils/form/final_form/MultiDateField'
import { validateLeaseCurrency } from '~/utils/form/validations'

const toggleNoPreferenceUsed = (form, event) => {
  // lease.preference_used need to be reset, otherwise SF validation fails
  if (isEmpty(event.target.value)) {
    form.change('lease.preference_used', '')
  }
  form.change('lease.no_preference_used', isEmpty(event.target.value))
}

const LeaseActions = ({ onSave, onCancelLeaseClick, onDelete, isNew, loading }) => (
  <div className='form-grid_item column'>
    <Button
      classes='primary margin-right'
      small
      onClick={onSave}
      disabled={loading}
      text='Save Lease'
    />
    <Button
      classes='secondary'
      small
      onClick={onCancelLeaseClick}
      disabled={loading}
      text='Cancel'
    />
    {!isNew && (
      <Button
        classes='alert-fill right'
        small
        onClick={onDelete}
        disabled={loading}
        text='Delete'
      />
    )}
  </div>
)

const Lease = ({ form, submitting, values, store }) => {
  const {
    availableUnits,
    application,
    handleSaveLease,
    handleDeleteLease,
    handleCancelLeaseClick
  } = store
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
              disabled={!availableUnitsOptions.length}
              disabledOptions={noUnitsOptions}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <ParkingInformationInputs form={form} values={values} />
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
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <Label label='Rental Assistance' />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <RentalAssistance form={form} submitting={submitting} />
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              label='Tenant Contribution'
              fieldName='lease.monthly_tenant_contribution'
              helpText='Monthly rent minus recurring rental assistance, if any'
              validation={validateLeaseCurrency}
              isDirty={getVisited('lease.monthly_tenant_contribution')}
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
            />
          </FormGrid.Item>
        </FormGrid.Row>
      </ContentSection.Sub>
      <FormGrid.Row>
        {/* TODO: Wire up actions for buttons, set to disabled when loading */}
        <LeaseActions
          onSave={handleSaveLease}
          onCancelLeaseClick={handleCancelLeaseClick}
          onDelete={handleDeleteLease}
          loading={false}
          isNew={false}
        />
      </FormGrid.Row>
    </InlineModal>
  )
}

export default withContext(Lease)
