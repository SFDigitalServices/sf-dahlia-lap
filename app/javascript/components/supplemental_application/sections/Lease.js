import React, { useState } from 'react'

import classNames from 'classnames'
import { capitalize, each, filter, map, isEmpty } from 'lodash'
import { Field } from 'react-final-form'

import ContentSection from 'components/molecules/ContentSection'
import FormGrid from 'components/molecules/FormGrid'
import InlineModal from 'components/molecules/InlineModal'
import ConfirmationModal from 'components/organisms/ConfirmationModal'
import {
  leaseEditClicked,
  leaseCanceled,
  deleteLeaseClicked,
  updateLease
} from 'components/supplemental_application/actions/leaseActionCreators'
import LEASE_STATES from 'components/supplemental_application/utils/leaseSectionStates'
import {
  doesApplicationHaveLease,
  getApplicationMembers,
  totalSetAsidesForPref
} from 'components/supplemental_application/utils/supplementalApplicationUtils'
import { UNIT_STATUS_AVAILABLE } from 'utils/consts'
import { useAppContext } from 'utils/customHooks'
import { CurrencyField, FieldError, Label, SelectField } from 'utils/form/final_form/Field'
import { MultiDateField } from 'utils/form/final_form/MultiDateField'
import { areLeaseAndRentalAssistancesValid } from 'utils/form/formSectionValidations'
import formUtils from 'utils/formUtils'
import { useFeatureFlag } from 'utils/hooks/useFeatureFlag'
import { addLayeredPreferenceFields } from 'utils/layeredPreferenceUtil'
import { pluck } from 'utils/utils'

import ParkingInformationInputs from './ParkingInformationInputs'
import { sortAndFilter } from './preferences/utils'
import RentalAssistance from './RentalAssistance'
import { convertPercentAndCurrency, validateLeaseCurrency } from '../../../utils/form/validations'
import Button from '../../atoms/Button'
import UnitDropdown from '../../molecules/UnitDropdown'

const NONE_PREFERENCE_LABEL = 'None'
const DTHP = 'Displaced Tenant Housing Preference (DTHP)'
const NRHP = 'Neighborhood Resident Housing Preference (NRHP)'
const toggleNoPreferenceUsed = (form, event) => {
  // lease.preference_used need to be reset, otherwise SF validation fails
  if (isEmpty(event.target.value)) {
    form.change('lease.preference_used', '')
  }
  form.change('lease.no_preference_used', isEmpty(event.target.value))
}

const UnitCountNote = ({ title, value, bold = false }) => (
  <FormGrid.Item width='25%'>
    <strong className='form-note micro h-caps'>{title}</strong>
    <p className='margin-top'>
      <span
        className={classNames('form-note', { 't-bold': bold })}
        id={`${title.toLowerCase()}-available-count`}
        data-testid={`${title.toLowerCase()}-available-count`}
      >
        {value}
      </span>
    </p>
  </FormGrid.Item>
)

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

const Lease = ({ form, values }) => {
  const { unleashFlag: unitStatusFlagEnabled } = useFeatureFlag('partners.unitStatus', false)

  const [
    {
      supplementalApplicationData: { supplemental: state }
    },
    dispatch
  ] = useAppContext()

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const isEditingMode = state.leaseSectionState === LEASE_STATES.EDIT_LEASE
  const disabled = !isEditingMode
  const getVisited = (fieldName) => form.getFieldState(fieldName)?.visited

  const openDeleteLeaseConfirmation = () => setShowDeleteConfirmation(true)
  const closeDeleteLeaseConfirmation = () => setShowDeleteConfirmation(false)

  const handleDeleteLeaseConfirmed = () => {
    setShowDeleteConfirmation(false)

    deleteLeaseClicked(dispatch, state.application)
  }

  const confirmedPreferences = filter(
    addLayeredPreferenceFields(sortAndFilter(state.application.preferences)),
    {
      layered_validation: 'Confirmed'
    }
  )

  const confirmedPreferenceOptions = formUtils.toOptions([
    formUtils.toEmptyOption(NONE_PREFERENCE_LABEL),
    ...map(confirmedPreferences, pluck('id', 'preference_name'))
  ])

  /**
   * available units fit the following criteria
   *  - if unitStatusFlagEnabled, check unit status is not occupied
   *  - else
   *    - if it doesn't have any leases
   *    - if there are leases, they cannot be in draft or signed status
   *    - if the unit has an application, it must match the current one
   *
   * todo: clean up feature flag code
   */
  const unavailableStatuses = ['Draft', 'Signed']
  const availableUnits = state.units.filter((unit) => {
    if (unitStatusFlagEnabled) return unit.status && unit.status === UNIT_STATUS_AVAILABLE

    return (
      !Array.isArray(unit.leases) ||
      !unit.leases.some((lease) => unavailableStatuses.includes(lease.lease_status)) ||
      unit.leases.some((lease) => lease.application_id === state.application.id)
    )
  })

  const availableUnitsOptions = formUtils.toOptions(
    map(availableUnits, pluck('id', 'unit_number', 'priority_type'))
  )

  const selectedUnit = form.getState().values.lease?.unit

  const areNoUnitsAvailable = !availableUnitsOptions.length

  const isSelected = (pref) => {
    const prefUsed = confirmedPreferences.find(
      (pref) => pref.id === form.getState().values.lease?.preference_used
    )
    return prefUsed?.preference_name === pref
  }

  /**
   * Checks if a given unit is using the same preference as the provided preference
   * @param unit
   * @param pref
   * @return {false|*} returns true if the unit is used with the same preference on a different application
   */
  const unitIsUsedWithPrefElsewhere = (unit, pref) =>
    Array.isArray(unit.leases) &&
    unit.leases.some(
      (lease) =>
        lease.application_id !== state.application.id && pref === lease.preference_used_name
    )

  const numUnitsUsingPref = (pref) =>
    state.units.filter(
      (unit) =>
        (unit.id === selectedUnit && isSelected(pref)) || unitIsUsedWithPrefElsewhere(unit, pref)
    ).length

  const remainingSetAsidesForPref = (pref) =>
    totalSetAsidesForPref(state.listing, pref) - numUnitsUsingPref(pref)

  // Selected unit does not count in available a11y units.
  const remainingPriorityUnits = availableUnits.filter(
    (unit) => unit.id !== selectedUnit && unit.priority_type?.match(/Mobility|Hearing|Vision/)
  )

  const handleCancelLeaseClick = (form) => {
    leaseCanceled(dispatch, state.application)

    // Reset lease and assistances on the form
    form.change('lease', state.application.lease)
    form.change('rental_assistances', state.application.rental_assistances)
  }

  const validateAndSaveLease = (form) => {
    if (areLeaseAndRentalAssistancesValid(form)) {
      const { application: prevApplication } = state
      updateLease(dispatch, convertPercentAndCurrency(form.getState().values), prevApplication)
    } else {
      // submit to force errors to display
      form.submit()
    }
  }

  const accessibilityRequests = []
  each(state.application.has_ada_priorities_selected, (value, request) => {
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
          <UnitCountNote
            title={'Total'}
            value={selectedUnit ? availableUnits.length - 1 : availableUnits.length}
            bold
          />
          <UnitCountNote title={'Accessibility'} value={remainingPriorityUnits.length} />
          <UnitCountNote title={'DTHP'} value={remainingSetAsidesForPref(DTHP)} />
          <UnitCountNote title={'NRHP'} value={remainingSetAsidesForPref(NRHP)} />
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
              <strong className='form-note'>
                {state.application.household_members.length + 1}
              </strong>
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
        <RentalAssistance
          applicationId={state.application.id}
          assistanceRowsOpened={state.assistanceRowsOpened}
          applicationMembers={getApplicationMembers(state.application)}
          disabled={disabled}
          form={form}
          loading={state.loading}
          rentalAssistances={state.application.rental_assistances || []}
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
          onEditLeaseClick={() => leaseEditClicked(dispatch)}
          onDelete={openDeleteLeaseConfirmation}
          loading={state.loading}
          leaseExists={doesApplicationHaveLease(state.application)}
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

export default Lease
