import { omitBy, isUndefined } from 'lodash'
import moment from 'moment'

import { API_DATE_FORMAT } from 'utils/utils'

export const mapShape = (mapper, value) => {
  if (value) {
    return mapper(value)
  } else {
    return {}
  }
}

export const mapList = (mapper, list) => {
  if (list) {
    return list.map(mapper)
  } else {
    return []
  }
}

export const compactShape = (obj) => omitBy(obj, isUndefined)

export const domainDateOfBirthToApi = (dateOfBirth) => {
  // Convert domain (json) DOB to API format ('YYYY-MM-DD')
  // Create moment and reformat to ensure that the integers are padded.
  const DOB = `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`
  return dateOfBirth && moment(DOB, API_DATE_FORMAT).format(API_DATE_FORMAT)
}
