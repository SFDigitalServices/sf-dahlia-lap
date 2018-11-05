import { omitBy, isUndefined } from 'lodash'
import moment from 'moment'

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
  return moment(dateOfBirth.join('-'), 'YYYY-MM-DD').format('YYYY-MM-DD')
}
