import React from 'react'
import { isEmpty } from 'lodash'
import { Form } from 'react-final-form'
import classNames from 'classnames'

import TableWrapper from '~/components/atoms/TableWrapper'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Button from '~/components/atoms/Button'
import { withContext } from '../context'
import FormGrid from '~/components/molecules/FormGrid'
import ExpandablePanel from '~/components/molecules/ExpandablePanel'
import formUtils from '~/utils/formUtils'
import validate from '~/utils/form/validations'
import { FieldWrapper, SelectField, YesNoRadioField } from '~/utils/form/final_form/Field'

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

const isOther = (values) => values.type_of_assistance === 'Other'

class RentalAssistanceTable extends React.Component {
  columns = [
    { content: 'Type of Assistance' },
    { content: 'Recurring Assistance' },
    { content: 'Assistance Amount' },
    { content: 'Recipient' },
    { content: 'Edit' }
  ]

  expanderRenderer = (row, expanded, expandedRowToggler) => {
    const handleEdit = () => {
      this.props.onEdit()
      expandedRowToggler()
    }

    return (!expanded && (
      <ExpanderButton label='Edit' onClick={handleEdit} />))
  }

  expandedRowRenderer = (row, toggle, original, form) => {
    return <Panel toggle={toggle} rentalAssistance={original} form={form} />
  }

  buildRows = () => this.props.rentalAssistances.map(ra => {
    const appMember = this.props.applicationMembers.find(m => m.id === ra.recipient)
    const appMemberName = appMember ? `${appMember.first_name} ${appMember.last_name}` : ''

    return [
      { content: ra.other_assistance_name || ra.type_of_assistance },
      { content: ra.recurring_assistance },
      { content: ra.assistance_amount ? `$${ra.assistance_amount}` : '' },
      { content: appMemberName }
    ]
  })

  render () {
    const rows = this.buildRows()

    return (
      <TableWrapper>
        <ExpandableTable
          originals={this.props.rentalAssistances}
          columns={this.columns}
          rows={rows}
          expanderRenderer={this.expanderRenderer}
          expandedRowRenderer={this.expandedRowRenderer}
          classes={['rental-assistances']}
        />
      </TableWrapper>
    )
  }
}

const Panel = withContext(({ idx, rentalAssistance, toggle, store, form }) => {
  const {
    handleUpdateRentalAssistance,
    handleDeleteRentalAssistance,
    applicationMembers,
    handleCloseRentalAssistancePanel,
    rentalAssistanceLoading
  } = store

  const onSave = async (values) => {
    const updateResult = await handleUpdateRentalAssistance(values)
    if (updateResult) toggle()
  }

  const onClose = () => {
    handleCloseRentalAssistancePanel()
    toggle()
  }

  const onDelete = async () => {
    const deleteResult = await handleDeleteRentalAssistance(rentalAssistance)
    if (deleteResult) toggle()
  }

  return (
    <ExpandablePanel>
      <AddRentalAssistanceForm
        values={rentalAssistance}
        onSave={onSave}
        onClose={onClose}
        onDelete={onDelete}
        applicationMembers={applicationMembers}
        loading={rentalAssistanceLoading}
      />
    </ExpandablePanel>
  )
})

const validateForm = (values) => {
  return {
    assistance_amount: (
      validate.isValidCurrency('Please enter a valid dollar amount.')(values.assistance_amount) ||
      validate.isUnderMaxValue(Math.pow(10, 5))('Please enter a smaller number.')(values.assistance_amount))
  }
}
class AddRentalAssistanceForm extends React.Component {
  render () {
    const { values, onSave, loading, onClose, applicationMembers, onDelete, isNew } = this.props
    const applicationMembersOptions = applicationMembers.map(member => (
      {
        label: `${member.first_name} ${member.last_name}`,
        value: member.id
      }
    ))

    return (
      <Form
        onSubmit={onSave}
        initialValues={values}
        validate={validateForm}
        render={({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit} noValidate>
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
                    fieldName='type_of_assistance'
                    options={typeOfAssistanceOptions}
                    className='rental-assistance-type'
                    validation={validate.isPresent('Please select a type of assistance.')}
                  />
                </FormGrid.Item>
                <FormGrid.Item>
                  <YesNoRadioField
                    label='Recurring Assistance'
                    fieldName='recurring_assistance'
                    uniqId={(!isEmpty(values) && values.id) || 'new'}
                    trueValue='Yes'
                    falseValue='No'
                    className='rental-assistance-recurring'
                  />
                </FormGrid.Item>
                <FormGrid.Item>
                  <FieldWrapper
                    label='Assistance Amount'
                    fieldName='assistance_amount'
                  />
                </FormGrid.Item>
                <FormGrid.Item>
                  <SelectField
                    label='Recipient'
                    fieldName='recipient'
                    options={applicationMembersOptions}
                    className='rental-assistance-recipient'
                  />
                </FormGrid.Item>
              </FormGrid.Row>
              {isOther(form.getState().values) && (
                <FormGrid.Row expand={false}>
                  <FormGrid.Item>
                    <FieldWrapper
                      label='Other Assistance Name'
                      fieldName='other_assistance_name' />
                  </FormGrid.Item>
                </FormGrid.Row>
              )}
              <FormGrid.Row expand={false}>
                <div className='form-grid_item column'>
                  <button
                    className='button primary tiny margin-right margin-bottom-none'
                    type='button'
                    onClick={form.submit}
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
          </form>
        )} />
    )
  }
}

const RentalAssistance = ({ store, form }) => {
  const {
    rentalAssistances,
    applicationMembers,
    showNewRentalAssistancePanel,
    handleOpenRentalAssistancePanel,
    handleCloseRentalAssistancePanel,
    handleSaveNewRentalAssistance,
    showAddRentalAssistanceBtn,
    hideAddRentalAssistanceBtn,
    rentalAssistanceLoading
  } = store

  const onSave = async (values) => {
    const test = 10
    console.log(values)
    console.log(test)
    await handleSaveNewRentalAssistance(values)
  }

  return (
    <React.Fragment>
      { !isEmpty(rentalAssistances) && (
        <RentalAssistanceTable
          rentalAssistances={rentalAssistances}
          applicationMembers={applicationMembers}
          onEdit={hideAddRentalAssistanceBtn}
        />
      )}

      { showNewRentalAssistancePanel && (
        <AddRentalAssistanceForm
          onSave={onSave}
          onClose={handleCloseRentalAssistancePanel}
          applicationMembers={applicationMembers}
          loading={rentalAssistanceLoading}
          values={form.getState().values.rental_assistance}
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
