import { createFieldMapper } from '~/utils/objectUtils'

export const householdMembersFieldMapper = {
  date_of_birth: 'DOB',
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  street: 'address',
  city: 'city',
  state: 'state',
  zip_code: 'zip'
}

export const mapHouseholdMembers = createFieldMapper(householdMembersFieldMapper)
