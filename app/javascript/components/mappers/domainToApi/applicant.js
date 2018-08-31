import { createFieldMapper} from '~/utils/objectUtils'

export const applicantFieldMapper = {
  date_of_birth: 'DOB',
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
  applicationId: (source) => source.id
}

export const mapApplicant = createFieldMapper(applicantFieldMapper)
