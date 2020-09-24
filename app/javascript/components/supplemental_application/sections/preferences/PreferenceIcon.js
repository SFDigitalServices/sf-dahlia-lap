import React from 'react'

import Icon from '~/components/atoms/Icon'

const PreferenceIcon = ({ status }) => {
  if (status === 'Invalid') {
    return <Icon icon='close' size='medium' alert />
  } else if (status === 'Confirmed') {
    return <Icon icon='check' size='medium' success />
  } else {
    return null
  }
}

export default PreferenceIcon
