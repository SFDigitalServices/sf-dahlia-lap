import React, { useState } from 'react'
import { capitalize, each, filter, map, isEmpty } from 'lodash'
import classNames from 'classnames'

import Button from 'components/atoms/Button'
import ContentSection from 'components/molecules/ContentSection'
import FormGrid from 'components/molecules/FormGrid'
import InlineModal from 'components/molecules/InlineModal'
import formUtils from 'utils/formUtils'
import ParkingInformationInputs from './ParkingInformationInputs'
import RentalAssistance from './RentalAssistance'
import UnitDropdown from '../../molecules/UnitDropdown'
import { convertPercentAndCurrency, validateLeaseCurrency } from '../../../utils/form/validations'
import ConfirmationModal from 'components/organisms/ConfirmationModal'

import { Field } from 'react-final-form'
import { pluck } from 'utils/utils'
import { withContext } from '../context'
import { CurrencyField, FieldError, Label, SelectField } from 'utils/form/final_form/Field.js'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'

import { EDIT_LEASE_STATE } from '../SupplementalApplicationPage'
import { doesApplicationHaveLease } from 'utils/leaseUtils'
import { areLeaseAndRentalAssistancesValid } from 'utils/form/formSectionValidations'

const NONE_PREFERENCE_LABEL = 'None'

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
        text={loading ? 'Saving...' : 'Save Lease'}
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

const Lease = ({ form, values, store }) => {
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

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const isEditingMode = leaseSectionState === EDIT_LEASE_STATE
  const disabled = !isEditingMode

  const availableUnitsOptions = formUtils.toOptions(
    map(availableUnits, pluck('id', 'unit_number', 'priority_type'))
  )

  const accessibilityUnits =
    availableUnits &&
    availableUnits.filter((unit) => {
      return unit.priority_type && unit.priority_type.match(/Mobility|Hearing|Vision/)
    })

  const confirmedPreferences = filter(application.preferences, {
    post_lottery_validation: 'Confirmed'
  })

  const confirmedPreferenceOptions = formUtils.toOptions([
    formUtils.toEmptyOption(NONE_PREFERENCE_LABEL),
    ...map(confirmedPreferences, pluck('id', 'preference_name'))
  ])

  const getVisited = (fieldName) => form.getFieldState(fieldName)?.visited

  const openDeleteLeaseConfirmation = () => setShowDeleteConfirmation(true)
  const closeDeleteLeaseConfirmation = () => setShowDeleteConfirmation(false)

  const handleDeleteLeaseConfirmed = () => {
    setShowDeleteConfirmation(false)
    handleDeleteLease()
  }

  const areNoUnitsAvailable = !availableUnitsOptions.length

  const validateAndSaveLease = (form) => {
    if (areLeaseAndRentalAssistancesValid(form)) {
      handleSaveLease(convertPercentAndCurrency(form.getState().values))
    } else {
      // submit to force errors to display
      form.submit()
    }
  }

  const accessibilityRequests = []
  each(application.has_ada_priorities_selected, (value, request) => {
    if (value) {
      accessibilityRequests.push(capitalize(request.replace('_impairments', '')))
    }
  })

  return (
    <InlineModal>
      <ContentSection.Header description='If the household receives recurring rental assistance, remember to subtract this from the unit’s rent when calculating Tenant Contribution.' />
      <ContentSection.Sub title='Unit and Parking'>
        <FormGrid.Row>
          <FormGrid.Item>
            <div className='margin-bottom'>
              <strong className='form-note small max-width'>
                Remaining Available Units and Set-Asides
              </strong>
            </div>
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item width='25%'>
            <strong className='form-note micro h-caps'>Total</strong>
            <p className='margin-top'>
              <strong className='form-note'>{availableUnits.length}</strong>
            </p>
          </FormGrid.Item>
          <FormGrid.Item width='25%'>
            <strong className='form-note micro h-caps'>Accessibility</strong>
            <p className='margin-top'>
              <span className='form-note'>{accessibilityUnits.length}</span>
            </p>
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <div className='margin-bottom'>
              <strong className='form-note small max-width'>Household Information</strong>
            </div>
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item width='25%'>
            <strong className='form-note micro h-caps'>Members</strong>
            <p className='margin-top'>
              <strong className='form-note'>{application.household_members.length + 1}</strong>
            </p>
          </FormGrid.Item>
          <FormGrid.Item width='50%'>
            <strong className='form-note micro h-caps'>Accessibility Requests</strong>
            <p className='margin-top'>
              <span className='form-note'>
                {isEmpty(accessibilityRequests) ? 'None' : accessibilityRequests.join(', ')}
              </span>
            </p>
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <Field
              name='lease.unit'
              component={({ input: { onChange }, meta }) => {
                const hasError = !values.unit && meta.touched && meta.error
                return (
                  <div className={classNames('form-group margin-bottom', hasError && 'error')}>
                    <Label label='Assigned Unit Number' fieldName='lease_unit' />
                    <UnitDropdown
                      availableUnits={availableUnits}
                      unit={values.lease.unit}
                      onChange={onChange}
                      disabled={disabled || areNoUnitsAvailable}
                    />
                    <FieldError meta={meta} />
                  </div>
                )
              }}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <ParkingInformationInputs form={form} values={values} disabled={disabled} />
      </ContentSection.Sub>
      <ContentSection.Sub title='Rent and Assistance'>
        <FormGrid.Row>
          <FormGrid.Item>
            <CurrencyField
              label='Monthly Rent'
              fieldName='lease.total_monthly_rent_without_parking'
              validation={validateLeaseCurrency}
              isDirty={getVisited('lease.total_monthly_rent_without_parking')}
              disabled={disabled}
            />
          </FormGrid.Item>
        </FormGrid.Row>
        <FormGrid.Row>
          <FormGrid.Item>
            <Label label='Rental Assistance' />
          </FormGrid.Item>
        </FormGrid.Row>
        <RentalAssistance form={form} disabled={disabled} loading={loading} />
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
              selectValue={values.lease.preference_used || NONE_PREFERENCE_LABEL}
              onChange={(value) => toggleNoPreferenceUsed(form, value)}
              fieldName='lease.preference_used'
              options={confirmedPreferenceOptions}
              disabled={disabled}
            />
          </FormGrid.Item>
        </FormGrid.Row>
      </ContentSection.Sub>
      <FormGrid.Row>
        <LeaseActions
          onSave={() => validateAndSaveLease(form)}
          onCancelLeaseClick={() => handleCancelLeaseClick(form)}
          onEditLeaseClick={handleEditLeaseClick}
          onDelete={openDeleteLeaseConfirmation}
          loading={loading}
          leaseExists={doesApplicationHaveLease(application)}
          isEditing={isEditingMode}
        />
      </FormGrid.Row>
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onCloseClick={closeDeleteLeaseConfirmation}
        onSecondaryClick={closeDeleteLeaseConfirmation}
        onPrimaryClick={handleDeleteLeaseConfirmed}
        primaryButtonIsAlert
        primaryText='Delete Lease'
        secondaryText='Continue Editing'
        subtitle='This will permanently delete the lease and all related rental assistances.'
        title='Are you sure you want to delete this lease?'
      />
    </InlineModal>
  )
}

export default withContext(Lease)
