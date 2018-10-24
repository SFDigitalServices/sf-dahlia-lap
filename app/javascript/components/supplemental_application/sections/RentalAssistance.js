import React from 'react'
import { map, isEmpty } from 'lodash'
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
import { buildHouseholdMembersOptions } from '~/components/applications/application_form/preferences/utils'

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

  expandedRowRenderer = (row, toggle, idx) => {
    return <Panel toggle={toggle} row={row} idx={idx} />
  }

  mapRow = (value) => {
    return [
      { content: value.type_of_assistance },
      { content: value.recurring_assitance },
      { content: value.assistance_amount },
      { content: value.recipient }
    ]
  }

  buildRows = () => map(this.props.rows, this.mapRow)

  render () {
    const rows = this.buildRows()
    return (
      <TableWrapper>
        <ExpandableTable
          columns={this.columns}
          rows={rows}
          expanderRenderer={this.expanderRenderer}
          expandedRowRenderer={this.expandedRowRenderer}
        />
      </TableWrapper>
    )
  }
}

const Panel = withContext(({ idx, row, toggle, store }) => {
  const {
    handleUpdateRentalAssistance,
    handleDeleteRentalAssistance,
    applicationMembers,
    handleCloseAddNewRentalAssistance
  } = store

  const onSave = (values) => {
    handleUpdateRentalAssistance(values, idx)
    toggle()
  }

  const onClose = () => {
    handleCloseAddNewRentalAssistance()
    toggle()
  }

  const onDelete = () => {
    handleDeleteRentalAssistance(idx)
    toggle()
  }

  const rowsToFields = (row) => {
    return {
      type_of_assistance: row[0].content,
      recurring_assitance: row[1].content,
      assistance_amount: row[2].content,
      recipient: row[3].content
    }
  }

  const values = rowsToFields(row)

  return (
    <ExpandablePanel>
      <AddRentalAssistanceForm
        values={values}
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
  const applicationMembersOptions = formUtils.toOptions(buildHouseholdMembersOptions(applicationMembers))
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
              <YesNoRadioGroup field='recurring_assitance' />
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
                <Text field='other_assitance_name' />
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
    handleAddRentalAssistance,
    addNewRentalAssistance,
    rentalAssistancesList,
    handleCloseAddNewRentalAssistance,
    handleSaveAddNewRentalAssistance,
    applicationMembers,
    showAddRentalAssitanceBtn,
    hideAddRentalAssitanceBtn
  } = store

  return (
    <React.Fragment>
      { !isEmpty(rentalAssistancesList) && (
        <RentalAssistanceTable rows={rentalAssistancesList} onEdit={hideAddRentalAssitanceBtn} />
      )}

      { addNewRentalAssistance && (
        <AddRentalAssistanceForm
          onSave={handleSaveAddNewRentalAssistance}
          onClose={handleCloseAddNewRentalAssistance}
          applicationMembers={applicationMembers}
          isNew
        />
      )}
      { showAddRentalAssitanceBtn && (
        <Button text='Add Rental Assistance' small onClick={handleAddRentalAssistance} />
      )}
    </React.Fragment>
  )
}

export default withContext(RentalAssistance)
