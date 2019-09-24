import React from 'react'
import { isEmpty, findIndex } from 'lodash'
import classNames from 'classnames'

import TableWrapper from '~/components/atoms/TableWrapper'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Button from '~/components/atoms/Button'
import { withContext } from '../context'
import FormGrid from '~/components/molecules/FormGrid'
import ExpandablePanel from '~/components/molecules/ExpandablePanel'
import formUtils from '~/utils/formUtils'
import validate from '~/utils/form/validations'
import { InputField, SelectField, YesNoRadioGroup, CurrencyField } from '~/utils/form/final_form/Field'

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

const RentalAssistanceTable = ({ form, rentalAssistances, onEdit, applicationMembers }) => {
  const columns = [
    { content: 'Type of Assistance' },
    { content: 'Recurring Assistance' },
    { content: 'Assistance Amount' },
    { content: 'Recipient' },
    { content: 'Edit' }
  ]

  const expanderRenderer = (row, expanded, expandedRowToggler) => {
    const handleEdit = () => {
      onEdit()
      expandedRowToggler()
    }

    return (!expanded && <ExpanderButton label='Edit' onClick={handleEdit} />)
  }

  const expandedRowRenderer = (rentalAssistances, form) => (row, toggle, original) => {
    const index = findIndex(rentalAssistances, original)

    return <Panel toggle={toggle} rentalAssistance={original} form={form} row={row} index={index} />
  }

  const buildRows = () => rentalAssistances.map(ra => {
    const appMember = applicationMembers.find(m => m.id === ra.recipient)
    const appMemberName = appMember ? `${appMember.first_name} ${appMember.last_name}` : ''

    return [
      { content: ra.other_assistance_name || ra.type_of_assistance },
      { content: ra.recurring_assistance },
      { content: ra.assistance_amount ? ra.assistance_amount : '' },
      { content: appMemberName }
    ]
  })

  const rows = buildRows()

  return (
    <TableWrapper>
      <React.Fragment>
        <ExpandableTable
          originals={rentalAssistances}
          columns={columns}
          rows={rows}
          expanderRenderer={expanderRenderer}
          expandedRowRenderer={expandedRowRenderer(rentalAssistances, form)}
          classes={['rental-assistances']}
        />
      </React.Fragment>
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
    <ExpandablePanel>
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
    </ExpandablePanel>
  )
})

const RentalAssistanceForm = ({ values, onSave, loading, onClose, applicationMembers, onDelete, isNew, index, form }) => {
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
      onSave(index, form.getState().values.rental_assistances[index])
    }
  }

  return (
    <React.Fragment>
      <div className={classNames(
        'app-editable expand-wide scrollable-table-nested',
        {
          'rental-assistance-new-form': isNew,
          'rental-assistance-edit-form': !isNew
        }
      )}>
        <FormGrid.Row expand={false}>
          <FormGrid.Item>
            <SelectField
              label='Type of Assistance'
              fieldName={`rental_assistances.${index}.type_of_assistance`}
              options={typeOfAssistanceOptions}
              className='rental-assistance-type'
              validation={validate.isPresent('Please select a type of assistance.')}
            />
          </FormGrid.Item>
          <FormGrid.Item>
            <YesNoRadioGroup
              label='Recurring Assistance'
              fieldName={`rental_assistances.${index}.recurring_assistance`}
              uniqId={(!isEmpty(values) && values.id) || 'new'}
              trueValue='Yes'
              falseValue='No'
              className='rental-assistance-recurring'
            />
          </FormGrid.Item>
          <FormGrid.Item>
            <CurrencyField
              label='Assistance Amount'
              fieldName={`rental_assistances.${index}.assistance_amount`}
              validation={validateAssistanceAmount}
              id='assistance_amount'
            />
          </FormGrid.Item>
          <FormGrid.Item>
            <SelectField
              label='Recipient'
              fieldName={`rental_assistances.${index}.recipient`}
              options={applicationMembersOptions}
              className='rental-assistance-recipient'
            />
          </FormGrid.Item>
        </FormGrid.Row>
        {isOther(form.getState().values.rental_assistances[index]) && (
          <FormGrid.Row expand={false}>
            <FormGrid.Item>
              <InputField
                label='Other Assistance Name'
                fieldName={`rental_assistances.${index}.other_assistance_name`} />
            </FormGrid.Item>
          </FormGrid.Row>
        )}
        <FormGrid.Row expand={false}>
          <div className='form-grid_item column'>
            <button
              className='button primary tiny margin-right margin-bottom-none'
              type='button'
              onClick={onSaveWithIndex}
              disabled={loading}>
              Save
            </button>
            <button
              className='button secondary tiny margin-right margin-bottom-none'
              type='button'
              onClick={onClose}
              disabled={loading}>
              Cancel
            </button>
            {!isNew && (
              <button
                className='button alert-fill tiny margin-bottom-none right'
                type='button'
                onClick={onDelete}
                disabled={loading}>
                Delete
              </button>
            )}
          </div>
        </FormGrid.Row>
      </div>
    </React.Fragment>
  )
}

const RentalAssistance = ({ store, form }) => {
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
    <React.Fragment>
      { !isEmpty(application.rental_assistances) && (
        <RentalAssistanceTable
          rentalAssistances={application.rental_assistances}
          applicationMembers={applicationMembers}
          onEdit={hideAddRentalAssistanceBtn}
          form={form}
        />
      )}

      { showNewRentalAssistancePanel && (
        <RentalAssistanceForm
          onSave={onSave}
          onClose={onClose}
          applicationMembers={applicationMembers}
          loading={rentalAssistanceLoading}
          values={{type_of_assistance: null}}
          index={application.rental_assistances.length}
          form={form}
          isNew
        />
      )}
      { showAddRentalAssistanceBtn && (
        <Button id='add-rental-assistance' text='Add Rental Assistance' small onClick={handleOpenRentalAssistancePanel} />
      )}
    </React.Fragment>
  )
}

export default withContext(RentalAssistance)
