import React from 'react'
import { isEmpty } from 'lodash'
import { Form, Select, Text } from 'react-form'

import TableWrapper from '~/components/atoms/TableWrapper'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Button from '~/components/atoms/Button'
import { withContext } from '../context'
import FormGrid from '~/components/molecules/FormGrid'
import ExpandablePanel from '~/components/molecules/ExpandablePanel'
import FormItem from '~/components/organisms/FormItem'
import YesNoRadioGroup from '../YesNoRadioGroup'
import formUtils from '~/utils/formUtils'

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

  expandedRowRenderer = (row, toggle, original) => {
    return <Panel toggle={toggle} rentalAssistance={original} />
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
        />
      </TableWrapper>
    )
  }
}

const Panel = withContext(({ idx, rentalAssistance, toggle, store }) => {
  const {
    handleUpdateRentalAssistance,
    handleDeleteRentalAssistance,
    applicationMembers,
    handleCloseRentalAssistancePanel
  } = store

  const onSave = (values) => {
    handleUpdateRentalAssistance(values)
    toggle()
  }

  const onClose = () => {
    handleCloseRentalAssistancePanel()
    toggle()
  }

  const onDelete = () => {
    handleDeleteRentalAssistance(rentalAssistance)
    toggle()
  }

  return (
    <ExpandablePanel>
      <AddRentalAssistanceForm
        values={rentalAssistance}
        onSave={onSave}
        onClose={onClose}
        onDelete={onDelete}
        applicationMembers={applicationMembers}
      />
    </ExpandablePanel>
  )
})

const isOther = (values) => values.type_of_assistance === 'Other'

const AddRentalAssistanceForm = ({ values, onSave, loading, onClose, applicationMembers, onDelete, isNew }) => {
  const applicationMembersOptions = applicationMembers.map(member => (
    {
      label: `${member.first_name} ${member.last_name}`,
      value: member.id
    }
  ))

  return (
    <Form onSubmit={onSave} defaultValues={values}>
      {formApi => (
        <div className='app-editable expand-wide scrollable-table-nested'>
          <FormGrid.Row expand={false}>
            <FormItem label='Type of Assistance'>
              <Select
                field='type_of_assistance'
                options={typeOfAssistanceOptions}
              />
            </FormItem>
            <FormItem label='Recurring Assistance'>
              <YesNoRadioGroup
                field='recurring_assistance'
                uniqId={(values && values.id) || 'new'}
                trueValue='Yes'
                falseValue='No'
              />
            </FormItem>
            <FormItem label='Assistance Amount'>
              <Text field='assistance_amount' type='number' />
            </FormItem>
            <FormItem label='Recipient'>
              <Select
                field='recipient'
                options={applicationMembersOptions}
              />
            </FormItem>
          </FormGrid.Row>
          {isOther(formApi.values) && (
            <FormGrid.Row expand={false}>
              <FormItem label='Other Assistance Name'>
                <Text field='other_assistance_name' />
              </FormItem>
            </FormGrid.Row>
          )}
          <FormGrid.Row expand={false}>
            <div className='form-grid_item column'>
              <button
                className='button primary tiny margin-right margin-bottom-none'
                type='button'
                onClick={formApi.submitForm}
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
              { !isNew && (
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
      )}
    </Form>
  )
}

const RentalAssistance = ({ store }) => {
  const {
    rentalAssistances,
    applicationMembers,
    addNewRentalAssistance,
    handleOpenRentalAssistancePanel,
    handleCloseRentalAssistancePanel,
    handleSaveNewRentalAssistance,
    showAddRentalAssistanceBtn,
    hideAddRentalAssistanceBtn
  } = store

  return (
    <React.Fragment>
      { !isEmpty(rentalAssistances) && (
        <RentalAssistanceTable
          rentalAssistances={rentalAssistances}
          applicationMembers={applicationMembers}
          onEdit={hideAddRentalAssistanceBtn}
        />
      )}

      { addNewRentalAssistance && (
        <AddRentalAssistanceForm
          onSave={handleSaveNewRentalAssistance}
          onClose={handleCloseRentalAssistancePanel}
          applicationMembers={applicationMembers}
          isNew
        />
      )}
      { showAddRentalAssistanceBtn && (
        <Button text='Add Rental Assistance' small onClick={handleOpenRentalAssistancePanel} />
      )}
    </React.Fragment>
  )
}

export default withContext(RentalAssistance)
