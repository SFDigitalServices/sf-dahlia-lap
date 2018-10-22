import React from 'react'
import { isEmpty } from 'lodash'
import { Select, Text } from 'react-form'

import TableWrapper from '~/components/atoms/TableWrapper'
import ExpandableTable from '~/components/molecules/ExpandableTable'
import Button from '~/components/atoms/Button'
import { withContext } from '../context'
import FormGrid from '~/components/molecules/FormGrid'
import YesNoRadioGroup from '../YesNoRadioGroup'

class RentalAssistanceTable extends React.Component {
  columns = [
    { content: 'Type of Assistance' },
    { content: 'Recurring Assistance' },
    { content: 'Assistance Amount' },
    { content: 'Recipint' },
    { content: 'Edit' }
  ]

  expanderAction = (row, expanded, expandedRowToggler) => {

  }

  expandedRowRenderer = (row, toggle) => {

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
          expanderRenderer={this.expanderAction}
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

const AddRentalAssistanceForm = ({ onSave, loading, onClose }) => {
  return (
    <div className='app-editable expand-wide scrollable-table-nested'>
      <FormGrid.Row expand={false}>
        <FormItem label='Type of Assistance'>
          <Select
            field=''
            options={[]}
          />
        </FormItem>
        <FormItem label='Recurring Assistance'>
          <YesNoRadioGroup />
        </FormItem>
        <FormItem label='Assistance Amount'>
          <Text field='total_monthly_rent' type='number' />
        </FormItem>
        <FormItem label='Recipint'>
          <Select
            field=''
            options={[]}
          />
        </FormItem>
      </FormGrid.Row>
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
            className='button secondary tiny margin-bottom-none'
            type='button'
            onClick={onClose}
            disabled={loading}>
            Cancel
          </button>
        </div>
      </FormGrid.Row>
    </div>
  )
}

const RentalAssistance = ({ store }) => {
  const {
    handleAddRentalAssistance,
    addNewRentalAssistance,
    rentalAssistancesList,
    handleCloseAddNewRentalAssistance,
    handleSaveAddNewRentalAssistance
  } = store

  return (
    <React.Fragment>
      { !isEmpty(rentalAssistancesList) && (
        <RentalAssistanceTable rows={rentalAssistancesList} />
      )}

      { addNewRentalAssistance && (
        <AddRentalAssistanceForm
          onSave={handleSaveAddNewRentalAssistance}
          onClose={handleCloseAddNewRentalAssistance}
        />
      )}

      { !addNewRentalAssistance && (
        <Button text='Add Rental Assistance' onClick={handleAddRentalAssistance} />
      )}

    </React.Fragment>
  )
}

export default withContext(RentalAssistance)
