import { createFieldMapper } from '~/utils/objectUtils'
import { domainDateOfBirthToApi } from '~/components/mappers/utils'

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
  second_phone: 'alternatePhone',
  second_phone_type: 'alternatePhoneType',
  marital_status: 'maritalStatus',
  appMemberId: (source) => source.id,
  DOB: (source) => domainDateOfBirthToApi(source.date_of_birth)
}

export const mapApplicant = createFieldMapper(applicantFieldMapper)
