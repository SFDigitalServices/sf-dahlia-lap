import moment from 'moment'

import { createFieldMapper } from '~/utils/objectUtils'

export const applicantFieldMapper = {
  email: 'email',
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  street: 'address',
  city: 'city',
  state: 'state',
  zip_code: 'zip',
  mailing_street: 'mailingAddress',
  mailing_city: 'mailingCity',
  mailing_state: 'mailingState',
  mailing_zip_code: 'mailingZip',
  phone: 'phone',
  phone_type: 'phoneType',
  marital_status: 'maritalStatus',
  applicationId: (source) => source.id,
  DOB: (source) => dateOfBirthToApi(source.date_of_birth)
}

const dateOfBirthToApi = (dateOfBirth) => {
  // Convert domain DOB [YYYY, MM, DD] to API format ('YYYY-MM-DD')
  // Create moment and reformat to ensure that the integers are padded.
  return moment(dateOfBirth.join('-'), 'YYYY-MM-DD').format('YYYY-MM-DD')
}

export const mapApplicant = createFieldMapper(applicantFieldMapper)
