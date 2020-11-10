import React, { useEffect, useState } from 'react'

import { isEmpty, findIndex } from 'lodash'

import Button from 'components/atoms/Button'
import TableWrapper from 'components/atoms/TableWrapper'
import ExpandableTable from 'components/molecules/ExpandableTable'
import FormGrid from 'components/molecules/FormGrid'
import InlineModal from 'components/molecules/InlineModal'
import {
  CurrencyField,
  HelpText,
  InputField,
  SelectField,
  YesNoRadioGroup
} from 'utils/form/final_form/Field'
import { isSingleRentalAssistanceValid } from 'utils/form/formSectionValidations'
import validate, { convertCurrency } from 'utils/form/validations'
import formUtils from 'utils/formUtils'

import { withContext } from '../context'

const { ExpanderButton } = ExpandableTable

const typeOfAssistance = [
  'Catholic Charities',
  'Compass Family',
  'Glide',
  'Hamilton Family',
  'Homeless Prenatal',
  'HOPWA',
  'Q Foundation: First Month’s Rent',
  'Q Foundation: Move-in Deposit',
  'Q Foundation: Person with Disability Rent Subsidy',
  'Q Foundation: Senior Rent Subsidy',
  'San Francisco AIDS Foundation',
  'Section 8 HCV (tenant) voucher',
  'Self-Help for the Elderly',
  'VASH voucher',
  'Other'
]

const typeOfAssistanceOptions = formUtils.toOptions(typeOfAssistance)

const isOther = (values) => values && values.type_of_assistance === 'Other'

export const RentalAssistanceTable = ({
  form,
  rentalAssistances,
  onCancelEdit,
  onSave,
  onDelete,
  applicationMembers,
  disabled,
  loading
}) => {
  const columns = [
    { content: 'Recipient' },
    { content: 'Type' },
    { content: 'Amount' },
    { content: 'Recurring' },
    { content: '' }
  ]

  const expanderRenderer = (row, expanded, expandedRowToggler) => {
    return !expanded && !disabled && <ExpanderButton label='Edit' onClick={expandedRowToggler} />
  }

  const expandedRowRenderer = (rentalAssistances, form) => (row, toggle, original) => {
    const index = findIndex(rentalAssistances, original)

    // Run the async function, if the result doesn't throw an error and returned a
    // truthy response, toggle the panel to show/hide
    const toggleIfSuccessful = (asyncFunc) => (...args) =>
      asyncFunc(...args).then((result) => {
        if (result) toggle()
      })

    const handleClose = () => {
      onCancelEdit(index)
      toggle()
    }

    const handleDelete = () => toggleIfSuccessful(onDelete)(rentalAssistances[index])
    const handleSave = (index) => toggleIfSuccessful(onSave)(index)

    return (
      <RentalAssistanceForm
        values={original}
        row={row}
        onSave={handleSave}
        onClose={handleClose}
        onDelete={handleDelete}
        index={index}
        applicationMembers={applicationMembers}
        loading={loading}
        form={form}
      />
    )
  }

  const buildRows = () =>
    rentalAssistances.map((ra) => {
      const appMember = applicationMembers.find((m) => m.id === ra.recipient)
      const appMemberName = appMember ? `${appMember.first_name} ${appMember.last_name}` : ''

      return [
        { content: appMemberName },
        { content: ra.other_assistance_name || ra.type_of_assistance },
        { content: ra.assistance_amount ? ra.assistance_amount : '', formatType: 'currency' },
        { content: ra.recurring_assistance }
      ]
    })

  const rows = buildRows()

  return (
    <TableWrapper marginTop>
      <ExpandableTable
        originals={rentalAssistances}
        columns={columns}
        rows={rows}
        expanderRenderer={expanderRenderer}
        expandedRowRenderer={expandedRowRenderer(rentalAssistances, form)}
        closeAllRows={disabled}
        classes={['rental-assistances']}
      />
    </TableWrapper>
  )
}

export const RentalAssistanceForm = ({
  values,
  onSave,
  loading,
  onClose,
  applicationMembers,
  onDelete,
  isNew,
  index,
  form,
  visited
}) => {
  const validateAssistanceAmount = (value) => {
    return (
      validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
      validate.isUnderMaxValue(Math.pow(10, 5))('Please enter a smaller number.')(value)
    )
  }

  const isFormValid = () => {
    const isValid = isSingleRentalAssistanceValid(form, index)
    if (!isValid) {
      // Force submit to show errors on forms
      form.submit()
    }
    return isValid
  }

  const applicationMembersOptions = applicationMembers.map((member) => ({
    label: `${member.first_name} ${member.last_name}`,
    value: member.id
  }))

  const handleSave = () => {
    if (isFormValid()) {
      onSave(index)
    }
  }

  const getField = (assistanceField) => `rental_assistances.${index}.${assistanceField}`

  const modalId = isNew ? 'rental-assistance-new-form' : `rental-assistance-edit-form-${index}`

  return (
    <InlineModal whiteBackground marginBottom={isNew} id={modalId}>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            label='Recipient'
            fieldName={getField('recipient')}
            options={applicationMembersOptions}
            className='rental-assistance-recipient'
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <SelectField
            label='Type of Assistance'
            fieldName={getField('type_of_assistance')}
            options={typeOfAssistanceOptions}
            className='rental-assistance-type'
            validation={validate.isPresent('Please select a type of assistance.')}
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <CurrencyField
            label='Assistance Amount'
            fieldName={getField('assistance_amount')}
            validation={validateAssistanceAmount}
            id='assistance_amount'
            isDirty={visited && visited[getField('assistance_amount')]}
          />
        </FormGrid.Item>
      </FormGrid.Row>
      <FormGrid.Row>
        <FormGrid.Item>
          <YesNoRadioGroup
            label='Recurring Assistance'
            fieldName={getField('recurring_assistance')}
            uniqId={values?.id || 'new'}
            trueValue='Yes'
            falseValue='No'
            className='rental-assistance-recurring'
          />
        </FormGrid.Item>
      </FormGrid.Row>
      {isOther(form.getState().values.rental_assistances[index]) && (
        <FormGrid.Row>
          <FormGrid.Item>
            <InputField
              label='Other Assistance Name'
              fieldName={getField('other_assistance_name')}
            />
          </FormGrid.Item>
        </FormGrid.Row>
      )}
      <FormGrid.Row>
        <div className='form-grid_item column'>
          <Button
            classes='primary margin-right'
            tiny
            onClick={handleSave}
            disabled={loading}
            noBottomMargin
            text={loading ? 'Saving...' : 'Save'}
            id='rental-assistance-save'
          />
          <Button
            classes='secondary'
            tiny
            onClick={onClose}
            disabled={loading}
            noBottomMargin
            text='Cancel'
            id='rental-assistance-cancel'
          />
          {!isNew && (
            <Button
              classes='alert-fill right'
              tiny
              onClick={onDelete}
              disabled={loading}
              noBottomMargin
              text='Delete'
              id='rental-assistance-delete'
            />
          )}
        </div>
      </FormGrid.Row>
    </InlineModal>
  )
}

const RentalAssistance = ({ store, form, visited, disabled }) => {
  const {
    application,
    applicationMembers,
    handleDeleteRentalAssistance,
    handleSaveRentalAssistance,
    loading
  } = store

  const [isEditingNewAssistance, setIsEditingNewAssistance] = useState(false)

  /**
   * When the disabled prop changes to false, hide the new assistance panel.
   */
  useEffect(() => {
    if (disabled) {
      setIsEditingNewAssistance(false)
    }
  }, [disabled])

  const handleOpenNewPanel = () => {
    setIsEditingNewAssistance(true)
  }

  const handleCloseNewPanel = () => {
    setIsEditingNewAssistance(false)
    handleCancelEdit(application.rental_assistances.length)
  }

  const handleCancelEdit = (index) => {
    const isNewAssistance = index === application.rental_assistances.length
    const assistanceToRevertTo = isNewAssistance ? {} : application.rental_assistances[index]
    form.change(`rental_assistances.${index}`, assistanceToRevertTo)
  }

  const handleSave = async (index, action = 'update') => {
    const entireForm = form.getState().values
    const rentalAssistance = convertCurrency(entireForm.rental_assistances[index])
    return handleSaveRentalAssistance(rentalAssistance, entireForm, action)
  }

  const handleSaveNewAssistance = async (index) =>
    handleSave(index, 'create').then(() => setIsEditingNewAssistance(false))

  const handleDelete = async (rentalAssistance) =>
    handleDeleteRentalAssistance(rentalAssistance, form.getState().values)

  return (
    <>
      {!isEmpty(application.rental_assistances) && (
        <RentalAssistanceTable
          rentalAssistances={application.rental_assistances}
          applicationMembers={applicationMembers}
          onCancelEdit={handleCancelEdit}
          onDelete={handleDelete}
          onSave={handleSave}
          form={form}
          loading={loading}
          disabled={disabled}
        />
      )}

      {!disabled && isEditingNewAssistance && (
        <FormGrid.Row expand={false}>
          <RentalAssistanceForm
            onSave={handleSaveNewAssistance}
            onClose={handleCloseNewPanel}
            applicationMembers={applicationMembers}
            loading={loading}
            values={{ type_of_assistance: null }}
            index={application.rental_assistances.length}
            form={form}
            visited={visited}
            isNew
          />
        </FormGrid.Row>
      )}
      {!isEditingNewAssistance && (
        <FormGrid.Row>
          <FormGrid.Item>
            {!disabled && (
              <Button
                id='add-rental-assistance'
                text='Add Rental Assistance'
                small
                disabled={loading}
                onClick={handleOpenNewPanel}
              />
            )}
            <div className={disabled ? 'margin-top' : 'margin-top--half'} />
            <HelpText note='Rental Assistance includes recurring vouchers and subsidies, as well as one-time grants and other assistance.' />
          </FormGrid.Item>
        </FormGrid.Row>
      )}
    </>
  )
}

export default withContext(RentalAssistance)
