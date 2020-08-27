import PropTypes from 'prop-types'

import { LEASE_UP_STATUS_VALUES, LEASE_UP_SUBSTATUS_VALUES } from '../statusUtils'

export default {
  status: PropTypes.oneOf(LEASE_UP_STATUS_VALUES),
  subStatus: PropTypes.oneOf(LEASE_UP_SUBSTATUS_VALUES),
  comment: PropTypes.string,
  timeStamp: PropTypes.number
}
