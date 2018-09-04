import { get } from 'lodash'
import { createFieldMapper } from '~/utils/objectUtils'

export const preferenceFieldMapper = {
  'recordtype_developername': 'recordTypeDevName',
  id: 'shortformPreferenceID',
  appMemberID: (preference) => get(preference, 'application_member.id'),
  certificate_number: 'certificateNumber',
  individual_preference: 'individualPreference',
  lw_type_of_proof: 'lwPreferenceProof',
  opt_out: 'optOut',
  type_of_proof: 'preferenceProof',
  city: 'city',
  state: 'state',
  street: 'address',
  zip_code: 'zipCode',
  listing_preference_id: 'listingPreferenceID',
  naturalKey: 'naturalKey' // This is not a field in saleforce
}

export const mapPreference = createFieldMapper(preferenceFieldMapper)
