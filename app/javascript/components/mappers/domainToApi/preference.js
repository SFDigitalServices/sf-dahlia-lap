import { createFieldMapper } from '~/utils/objectUtils'

export const preferenceFieldMapper = {
  'recordtype_developername': 'recordTypeDevName',
  id: 'shortformPreferenceID',
  'application_member__r.id': 'appMemberID',
  certificate_number: 'certificateNumber',
  individual_preference: 'individualPreference',
  lw_type_of_proof__c: 'lwPreferenceProof',
  opt_out: 'optOut',
  type_of_proof: "preferenceProof",
  city: 'city',
  state: 'state',
  street: 'address',
  zip_code: 'zipCode',
  listing_preference_id: 'listingPreferenceID',
  naturalKey:'naturalKey'
}

export const mapPreference = createFieldMapper(preferenceFieldMapper)
