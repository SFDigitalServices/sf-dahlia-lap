import { createFieldMapper} from '~/utils/objectUtils'

export const alternateContactFieldMapper = {
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  alternate_contact_type: 'alternateContactType',
  alternate_contact_type_other: 'alternateContactTypeOther',
  agency_name: 'agency',
  email: 'email',
  phone: 'phone',
  phone_type: 'phoneType'
}

export const mapAlternateContact = createFieldMapper(alternateContactFieldMapper)
