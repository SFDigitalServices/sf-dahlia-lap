import { omitBy, isUndefined } from 'lodash'
import moment from 'moment'
import { API_DATE_FORMAT } from '~/utils/utils'

export const mapShape = (mapper, value) => {
  if (value) { return mapper(value) } else { return undefined }
}

export const mapList = (mapper, list) => {
  if (list) { return list.map(mapper) } else { return undefined }
}

export const compactShape = obj => omitBy(obj, isUndefined)

export const domainDateOfBirthToApi = (dateOfBirth) => {
  // Convert domain DOB [YYYY, MM, DD] to API format ('YYYY-MM-DD')
  // Create moment and reformat to ensure that the integers are padded.
  return dateOfBirth && moment(dateOfBirth.join('-'), API_DATE_FORMAT).format(API_DATE_FORMAT)
}
