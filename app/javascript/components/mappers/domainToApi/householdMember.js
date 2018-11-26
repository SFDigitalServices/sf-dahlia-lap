import { createFieldMapper } from '~/utils/objectUtils'
import { domainDateOfBirthToApi } from '~/components/mappers/utils'

export const householdMembersFieldMapper = {
  first_name: 'firstName',
  last_name: 'lastName',
  middle_name: 'middleName',
  street: 'address',
  city: 'city',
  state: 'state',
  zip_code: 'zip',
  DOB: (source) => domainDateOfBirthToApi(source.date_of_birth)
}

export const mapHouseholdMembers = createFieldMapper(householdMembersFieldMapper)
