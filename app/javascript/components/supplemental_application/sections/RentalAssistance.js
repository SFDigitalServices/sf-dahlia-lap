import React from 'react'
import { isEmpty, findIndex } from 'lodash'

import TableWrapper from '~/components/atoms/TableWrapper'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Button from '~/components/atoms/Button'
import { withContext } from '../context'
import FormGrid from '~/components/molecules/FormGrid'
import InlineModal from '~/components/molecules/InlineModal'
import formUtils from '~/utils/formUtils'
import validate, { convertCurrency } from '~/utils/form/validations'
import {
  CurrencyField,
  HelpText,
  InputField,
  SelectField,
  YesNoRadioGroup
} from '~/utils/form/final_form/Field'

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

const RentalAssistanceTable = ({
  form,
  submitting,
  rentalAssistances,
  onEdit,
  applicationMembers,
  disabled
}) => {
  const columns = [
    { content: 'Recipient' },
    { content: 'Type' },
    { content: 'Amount' },
    { content: 'Recurring' },
    { content: '' }
  ]

  const expanderRenderer = (row, expanded, expandedRowToggler) => {
    const handleEdit = () => {
      onEdit()
      expandedRowToggler()
    }

    return (!expanded && !disabled && <ExpanderButton label='Edit' onClick={handleEdit} />)
  }

  const expandedRowRenderer = (rentalAssistances, form) => (row, toggle, original) => {
    const index = findIndex(rentalAssistances, original)

    return <Panel toggle={toggle} rentalAssistance={original} form={form} row={row} index={index} />
  }

  const buildRows = () => rentalAssistances.map(ra => {
    const appMember = applicationMembers.find(m => m.id === ra.recipient)
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
        closeAllRows={submitting}
        classes={['rental-assistances']}
      />
    </TableWrapper>
  )
}

const Panel = withContext(({ rentalAssistance, toggle, store, row, index, form }) => {
  const {
    handleSaveRentalAssistance,
    handleDeleteRentalAssistance,
    applicationMembers,
    handleCloseRentalAssistancePanel,
    rentalAssistanceLoading
  } = store

  const onSave = async (index, values) => {
    const updateResult = await handleSaveRentalAssistance(values, form.getState().values, 'update')
    if (updateResult) toggle()
  }

  const onClose = () => {
    form.change(`rental_assistances.${index}`, rentalAssistance)
    handleCloseRentalAssistancePanel()
    toggle()
  }

  const onDelete = async () => {
    const deleteResult = await handleDeleteRentalAssistance(
      rentalAssistance,
      form.getState().values
    )
    if (deleteResult) toggle()
  }

  return (
    <RentalAssistanceForm
      values={rentalAssistance}
      row={row}
      onSave={onSave}
      onClose={onClose}
      onDelete={onDelete}
      index={index}
      applicationMembers={applicationMembers}
      loading={rentalAssistanceLoading}
      form={form}
    />
  )
})

const RentalAssistanceForm = ({
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
    return validate.isValidCurrency('Please enter a valid dollar amount.')(value) ||
      validate.isUnderMaxValue(Math.pow(10, 5))('Please enter a smaller number.')(value)
  }

  const isFormValid = () => {
    const isValid = isEmpty(form.getState().errors.rental_assistances) || isEmpty(form.getState().errors.rental_assistances[index])
    if (!isValid) {
      // Force submit to show errors on forms
      form.submit()
    }
    return isValid
  }

  const applicationMembersOptions = applicationMembers.map(member => (
    {
      label: `${member.first_name} ${member.last_name}`,
      value: member.id
    }
  ))

  const onSaveWithIndex = () => {
    if (isFormValid()) {
      onSave(index, convertCurrency(form.getState().values.rental_assistances[index]))
    }
  }

  const getField = (assistanceField) => `rental_assistances.${index}.${assistanceField}`

  const modalId = isNew ? 'rental-assistance-new-form' : `rental-assistance-edit-form-${index}`

  return (
    <InlineModal whiteBackground marginBottom={isNew} id={modalId} >
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
            uniqId={(values?.id) || 'new'}
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
              fieldName={getField('other_assistance_name')} />
          </FormGrid.Item>
        </FormGrid.Row>
      )}
      <FormGrid.Row>
        <div className='form-grid_item column'>
          <Button
            classes='primary margin-right'
            tiny
            onClick={onSaveWithIndex}
            disabled={loading}
            noBottomMargin
            text='Save'
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

const RentalAssistance = ({
  store,
  form,
  submitting,
  visited,
  disabled
}) => {
  const {
    application,
    applicationMembers,
    showNewRentalAssistancePanel,
    handleOpenRentalAssistancePanel,
    handleCloseRentalAssistancePanel,
    handleSaveRentalAssistance,
    showAddRentalAssistanceBtn,
    hideAddRentalAssistanceBtn,
    rentalAssistanceLoading
  } = store

  const onSave = async (_, values) => {
    await handleSaveRentalAssistance(values, form.getState().values, 'create')
  }

  const onClose = () => {
    form.change(`rental_assistances.${application.rental_assistances.length}`, {})
    handleCloseRentalAssistancePanel()
  }

  return (
    <>
      {!isEmpty(application.rental_assistances) && (
        <RentalAssistanceTable
          rentalAssistances={application.rental_assistances}
          applicationMembers={applicationMembers}
          onEdit={hideAddRentalAssistanceBtn}
          form={form}
          submitting={submitting}
          disabled={disabled}
        />
      )}

      {!disabled && showNewRentalAssistancePanel && (
        <FormGrid.Row expand={false}>
          <RentalAssistanceForm
            onSave={onSave}
            onClose={onClose}
            applicationMembers={applicationMembers}
            loading={rentalAssistanceLoading}
            values={{ type_of_assistance: null }}
            index={application.rental_assistances.length}
            form={form}
            visited={visited}
            isNew
          />
        </FormGrid.Row>
      )}
      {showAddRentalAssistanceBtn && (
        <FormGrid.Row>
          <FormGrid.Item>
            {!disabled && (
              <Button
                id='add-rental-assistance'
                text='Add Rental Assistance'
                small
                onClick={handleOpenRentalAssistancePanel}
              />
            )}
            <div className={disabled ? 'margin-top' : 'margin-top--half'} />
            <HelpText
              note='Rental Assistance includes recurring vouchers and subsidies, as well as one-time grants and other assistance.'
            />
          </FormGrid.Item>
        </FormGrid.Row>
      )}
    </>
  )
}

export default withContext(RentalAssistance)
