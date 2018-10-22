import React from 'react'
import { isEmpty } from 'lodash'
import { Form, Select, Text } from 'react-form'

import TableWrapper from '~/components/atoms/TableWrapper'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Button from '~/components/atoms/Button'
import { withContext } from '../context'
import FormGrid from '~/components/molecules/FormGrid'
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
    { content: 'Recipint' },
    { content: 'Edit' }
  ]

  expanderRenderer = (row, expanded, expandedRowToggler) => {
    return <ExpanderButton label='Edit' onClick={expandedRowToggler} />
  }

  expandedRowRenderer = (row, toggle) => {
    return <Panel toggle={toggle} />
  }

  buildRows = () => {
    return this.props.rows
  }

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

export const FormItem = ({label, children}) => (
  <FormGrid.Item>
    <FormGrid.Group label={label}>
      {children}
    </FormGrid.Group>
  </FormGrid.Item>
)

const Panel = withContext(({ toggle, store }) => {
  const {
    handleUpdateRentalAssistance,
    applicationMembers
  } = store

  const onSave = () => {
    toggle()
    handleUpdateRentalAssistance()
  }

  const onClose = () => {
    toggle()
  }

  const onDelete = () => {
    toggle()
  }

  return (
    <div className='app-editable expand-wide scrollable-table-nested'>
      <AddRentalAssistanceForm
        onSave={onSave}
        onClose={onClose}
        onDelete={onDelete}
        applicationMembers={applicationMembers}
      />
    </div>
  )
})

const isOther = (values) => values.type_of_assistance === 'Other'

const AddRentalAssistanceForm = ({ onSave, loading, onClose, applicationMembers, onDelete, isNew }) => {
  const applicationMembersOptions = formUtils.toOptions(buildHouseholdMembersOptions(applicationMembers))
  return (
    <Form onSubmit={onSave}>
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
              <YesNoRadioGroup />
            </FormItem>
            <FormItem label='Assistance Amount'>
              <Text field='' type='number' />
            </FormItem>
            <FormItem label='Recipint'>
              <Select
                field=''
                options={applicationMembersOptions}
              />
            </FormItem>
          </FormGrid.Row>
          {isOther(formApi.values) && (
            <FormGrid.Row expand={false}>
              <FormItem label='Other Assistance Name'>
                <Text field='' type='number' />
              </FormItem>
            </FormGrid.Row>
          )}
          <FormGrid.Row expand={false}>
            <div className='form-grid_item column'>
              <button
                className='button primary tiny margin-right margin-bottom-none save-panel-btn'
                type='button'
                onClick={onSave}
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
                  className='button alert-fill tiny margin-bottom-none'
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
    applicationMembers
  } = store

  return (
    <React.Fragment>
      { !addNewRentalAssistance && !isEmpty(rentalAssistancesList) && (
        <RentalAssistanceTable rows={rentalAssistancesList} />
      )}

      { addNewRentalAssistance ? (
        <AddRentalAssistanceForm
          onSave={handleSaveAddNewRentalAssistance}
          onClose={handleCloseAddNewRentalAssistance}
          applicationMembers={applicationMembers}
          isNew
        />
      ) : (
        <Button text='Add Rental Assistance' onClick={handleAddRentalAssistance} />
      )}
    </React.Fragment>
  )
}

export default withContext(RentalAssistance)
