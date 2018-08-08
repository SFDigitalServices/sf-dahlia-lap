import _ from 'lodash'

const labelize = (options) => (
  _.map(options, (option) => (
    { value: option, label: option }
  ))
)

const phone_type_options = labelize([
  'Home',
  'Cell',
  'Work',
])

const alternate_contact_options = labelize([
  'Family Member',
  'Friend',
  'Social Worker or Housing Counselor',
  'Other',
])

const gender_options = labelize([
  'Female',
  'Male',
  'Genderqueer/Gender Non-binary',
  'Trans Female',
  'Trans Male',
  'Not Listed',
  'Decline to state',
])

const sex_at_birth_options = labelize([
  'Female',
  'Male',
  'Decline to answer',
])

const relationship_options = labelize([
  'Spouse',
  'Registered Domestic Partner',
  'Parent',
  'Child',
  'Sibling',
  'Cousin',
  'Aunt',
  'Uncle',
  'Nephew',
  'Niece',
  'Grandparent',
  'Great Grandparent',
  'In-Law',
  'Friend',
  'Other',
])

const ethnicity_options = labelize([
  'Hispanic/Latino',
  'Not Hispanic/Latino',
  'Decline to state',
])

const race_options = labelize([
  'American Indian/Alaskan Native',
  'Asian',
  'Black/African American',
  'Native Hawaiian/Other Pacific Islander',
  'White',
  'American Indian/Alaskan Native and Black/African American',
  'American Indian/Alaskan Native and White',
  'Asian and White',
  'Black/African American and White',
  'Other/Multiracial',
  'Decline to state',
])

const sexual_orientation_options = labelize([
  'Bisexual',
  'Gay/Lesbian/Same-Gender Loving',
  'Questioning/Unsure',
  'Straight/Heterosexual',
  'Not listed',
  'Decline to state',
])

const preference_proof_options_default = labelize([
  'Telephone bill',
  'Cable and internet bill',
  'Gas bill',
  'Electric bill',
  'Garbage bill',
  'Water bill',
  'Paystub',
  'Public benefits record',
  'School record',
])

const preference_proof_options_live_sf = labelize([
  'Telephone bill',
  'Cable and internet bill',
  'Gas bill',
  'Electric bill',
  'Garbage bill',
  'Water bill',
  'Paystub',
  'Public benefits record',
  'School record',
  'Letter documenting homelessness'
])

const preference_proof_options_work_sf = labelize([
  'Letter from employer',
  'Paystub with employer address',
])

const preference_proof_options_rent_burden = labelize([
  'Money order',
  'Cancelled check',
  'Debit from your bank account',
  'Screenshot of online payment',
])

const preference_proof_options_nrhp = labelize([
  'Telephone bill',
  'Cable and internet bill',
  'Gas bill',
  'Electric bill',
  'Garbage bill',
  'Water bill',
  'Paystub',
  'Public benefits record',
  'School record',
  'Letter documenting homelessness',
])

const priority_options = [
  'Mobility impaired',
  'Vision impaired',
  'Hearing impaired',
]

const listing_referral_options = labelize([
  'Newspaper',
  'MOHCD Website',
  'Developer Website',
  'Flyer',
  'Email Alert',
  'Friend',
  'Housing Counselor',
  'Radio Ad',
  'Bus Ad',
  'Other',
])

const adaPriorityValueToLabelMap = {
  mobility_impaired: 'Mobility impaired',
  vision_impaired: 'Vision impaired',
  hearing_impaired: 'Hearing impaired'
}

const yes_no_options = labelize([
  'Yes',
  'No',
  'Left Blank',
])

export default {
  phone_type_options,
  alternate_contact_options,
  gender_options,
  sex_at_birth_options,
  relationship_options,
  ethnicity_options,
  race_options,
  sexual_orientation_options,
  preference_proof_options_default,
  preference_proof_options_live_sf,
  preference_proof_options_work_sf,
  preference_proof_options_rent_burden,
  preference_proof_options_nrhp,
  priority_options,
  listing_referral_options,
  yes_no_options,
  adaPriorityValueToLabelMap
}
