import React from 'react'

import { LEASE_UP_STATUS_OPTIONS, LEASE_UP_SUBSTATUS_OPTIONS, getLeaseUpStatusClass } from '~/utils/statusUtils'
import Dropdown from '../molecules/Dropdown'

const StatusDropdown = ({ status, onChange, buttonClasses, menuClasses, wrapperClasses, styles, disabled, subStatus, showSubStatus, prompt }) => {
  let dropdownButtonClasses = !showSubStatus ? [getLeaseUpStatusClass(status)] : []
  if (buttonClasses) dropdownButtonClasses.push(...buttonClasses)

  return (
    !showSubStatus ? (
      <Dropdown
        items={LEASE_UP_STATUS_OPTIONS}
        value={status}
        prompt={prompt || 'Status'}
        onChange={val => onChange(val)}
        buttonClasses={dropdownButtonClasses}
        menuClasses={menuClasses}
        wrapperClasses={wrapperClasses}
        styles={styles}
        disabled={disabled} />
    ) : showSubStatus && status && LEASE_UP_SUBSTATUS_OPTIONS[status] ? (
      <Dropdown
        items={LEASE_UP_SUBSTATUS_OPTIONS[status]}
        value={subStatus}
        prompt={prompt}
        onChange={val => onChange(val, 'subStatus')}
        buttonClasses={dropdownButtonClasses}
        menuClasses={menuClasses}
        wrapperClasses={wrapperClasses}
        styles={styles}
        disabled={disabled} />
    ) : null
  )
}

export default StatusDropdown
