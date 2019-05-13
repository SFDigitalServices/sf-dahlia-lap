import React from 'react'

import { LEASE_UP_STATUS_OPTIONS, getLeaseUpStatusClass } from '~/utils/statusUtils'
import Dropdown from '../molecules/Dropdown'

const StatusDropdown = ({ status, onChange, buttonClasses, menuClasses, wrapperClasses, styles, disabled }) => {
  let dropdownButtonClasses = [getLeaseUpStatusClass(status)]
  if (buttonClasses) dropdownButtonClasses.push(...buttonClasses)

  return (
    <Dropdown
      items={LEASE_UP_STATUS_OPTIONS}
      value={status}
      prompt='Status'
      onChange={onChange}
      buttonClasses={dropdownButtonClasses}
      menuClasses={menuClasses}
      wrapperClasses={wrapperClasses}
      styles={styles}
      disabled={disabled} />
  )
}

export default StatusDropdown
