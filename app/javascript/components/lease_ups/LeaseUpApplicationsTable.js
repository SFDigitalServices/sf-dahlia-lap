import React from 'react'

import classNames from 'classnames'
import { trim } from 'lodash'
import { Link, useNavigate } from 'react-router-dom'
import ReactTable from 'react-table'

import {
  applicationRowClicked,
  applicationsTablePageChanged
} from 'components/lease_ups/actions/actionCreators'
import CheckboxCell from 'components/lease_ups/application_page/CheckboxCell'
import PreferenceRankCell from 'components/lease_ups/application_page/PreferenceRankCell'
import StatusCell from 'components/lease_ups/application_page/StatusCell'
import appPaths from 'utils/appPaths'
import { useAppContext } from 'utils/customHooks'
import { MAX_SERVER_LIMIT } from 'utils/EagerPagination'
import { cellFormat } from 'utils/reactTableUtils'
import { getLeaseUpStatusClass } from 'utils/statusUtils'

const CELL_PADDING_PX = 16
const STATUS_COLUMN_WIDTH_PX = 192

const getCellWidth = (baseSizePx, isAtStartOrEnd = false) => {
  // We put 1/2 cell padding on either side of every cell so that the total padding between
  // cells is CELL_PADDING_PX. However, if the cell is at the start or end we want the full
  // padding on one side and half padding on the other side, so we need to multiply the padding by 1.5x.
  const padding = isAtStartOrEnd ? 1.5 * CELL_PADDING_PX : CELL_PADDING_PX
  return baseSizePx + padding
}

const textCell = ({ value }) => {
  const textStyle = {
    width: '100%',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }

  return (
    <div style={textStyle} title={value}>
      {value}
    </div>
  )
}

const LeaseUpApplicationsTable = ({
  dataSet,
  prefMap,
  onLeaseUpStatusChange,
  pages,
  rowsPerPage,
  atMaxPages,
  bulkCheckboxesState,
  onBulkCheckboxClick
}) => {
  const [
    {
      applicationsListData: { page }
    },
    dispatch
  ] = useAppContext()

  const navigate = useNavigate()

  const updateSelectedApplicationState = (application, navigateToApplication = false) => {
    applicationRowClicked(dispatch, application)

    if (navigateToApplication) {
      navigate(appPaths.toLeaseUpApplication(application.application_id))
    }
  }

  const maxPagesMsg = `Unfortunately, we can only display the first ${
    MAX_SERVER_LIMIT / rowsPerPage
  } pages of applications at this time. Please use the filters above to narrow your results.`
  const noDataMsg =
    atMaxPages || page >= 100 ? maxPagesMsg : 'No results, try adjusting your filters'

  const getPreferenceValidation = (cell) => {
    return cell.original.layered_preference_validation
      ? cell.original.layered_preference_validation
      : cell.original.post_lottery_validation
  }

  const columns = [
    {
      Header: '',
      accessor: 'bulk_checkbox',
      headerClassName: 'non-resizable',
      width: getCellWidth(24, true),
      Cell: (cell) => {
        const appId = cell.original.application_id
        return (
          <CheckboxCell
            checked={bulkCheckboxesState[appId]}
            applicationId={appId}
            onClick={() => onBulkCheckboxClick(appId)}
          />
        )
      }
    },
    {
      Header: 'Rank',
      accessor: 'rankOrder',
      headerClassName: 'non-resizable',
      width: getCellWidth(88),
      // only show the preference validation if the listing type has preferences
      // first come first served listings do not have preferences
      Cell: (cell) => (
        <PreferenceRankCell
          preferenceRank={cell.original.preference_rank}
          preferenceValidation={getPreferenceValidation(cell)}
        />
      )
    },
    {
      Header: 'Application',
      accessor: 'application_number',
      headerClassName: 'non-resizable',
      width: getCellWidth(96),
      Cell: (cell) => (
        <Link
          to={appPaths.toLeaseUpApplication(cell.original.application_id)}
          onClick={() => updateSelectedApplicationState(cell.original, false)}
        >
          {cell.value}
        </Link>
      )
    },
    {
      Header: 'First Name',
      accessor: 'first_name',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(98),
      Cell: textCell
    },
    {
      Header: 'Last Name',
      accessor: 'last_name',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(98),
      Cell: textCell
    },
    {
      Header: 'HH',
      accessor: 'total_household_size',
      headerClassName: 'non-resizable',
      width: getCellWidth(24)
    },
    {
      Header: 'Requests',
      accessor: 'accessibility',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(84),
      Cell: textCell
    },
    {
      Header: 'Updated',
      accessor: 'status_last_updated',
      headerClassName: 'non-resizable',
      minWidth: getCellWidth(75),
      Cell: cellFormat.date
    },
    {
      Header: 'Latest Substatus',
      accessor: 'sub_status',
      className: 'td-offset-right',
      headerClassName: 'td-offset-right',

      // this cell actually goes underneath the fixed column,
      // so it needs to combine both cells' widths.
      minWidth: getCellWidth(153 + STATUS_COLUMN_WIDTH_PX),
      Cell: textCell
    },
    {
      Header: 'Status',
      accessor: 'lease_up_status',
      className: 'td-status td-fixed-right',
      headerClassName: 'tr-fixed-right',
      minWidth: getCellWidth(STATUS_COLUMN_WIDTH_PX, true),
      Cell: (cell) => {
        const { application_id: applicationId } = cell.original
        return (
          <StatusCell
            applicationId={applicationId}
            status={cell.value}
            onChange={(val) => onLeaseUpStatusChange(val, applicationId, false)}
          />
        )
      }
    }
  ]

  const getTdProps = (state, rowInfo, column) => {
    const attrs = {}

    // onClick actions vary depending on the type of column
    if (
      column.id !== 'application_number' &&
      column.id !== 'lease_up_status' &&
      column.id !== 'bulk_checkbox'
    ) {
      attrs.onClick = (e, handleOriginal) => {
        if (rowInfo) updateSelectedApplicationState(rowInfo.original, true)
      }
    }

    return attrs
  }

  const getTrProps = (state, rowInfo, column) => {
    const statusClassName =
      rowInfo && !!trim(rowInfo.row.lease_up_status)
        ? getLeaseUpStatusClass(rowInfo.row.lease_up_status)
        : ''

    const trClassName = classNames('rt-tr-status', statusClassName)

    return {
      className: trClassName,
      tabIndex: '0'
    }
  }

  // Selecting the size of pages does not work with manual override.
  const getPaginationProps = () => {
    return {
      showPageSizeOptions: false
    }
  }

  return (
    <ReactTable
      manual
      className='rt-table-status'
      data={dataSet}
      page={page}
      onPageChange={(newPage) => applicationsTablePageChanged(dispatch, newPage)}
      pages={pages}
      columns={columns}
      getTdProps={getTdProps}
      getTrProps={getTrProps}
      defaultPageSize={rowsPerPage}
      sortable={false}
      noDataText={noDataMsg}
      getPaginationProps={getPaginationProps}
    />
  )
}

export default LeaseUpApplicationsTable
