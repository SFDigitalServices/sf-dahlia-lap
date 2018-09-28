import _ from 'lodash'

const labelize = (options) => (
  _.map(options, (option) => (
    { value: option, label: option }
  ))
)

const applicationLanguageOptions = labelize([
  'English',
  'Chinese',
  'Spanish',
  'Tagalog'
])

const phoneTypeOptions = labelize([
  'Home',
  'Cell',
  'Work'
])

const alternateContactOptions = labelize([
  'Family Member',
  'Friend',
  'Social Worker or Housing Counselor',
  'Other'
])

const genderOptions = labelize([
  'Female',
  'Male',
  'Genderqueer/Gender Non-binary',
  'Trans Female',
  'Trans Male',
  'Not Listed',
  'Decline to state'
])

const sexAtBirthOptions = labelize([
  'Female',
  'Male',
  'Decline to answer'
])

const relationshipOptions = labelize([
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
  'Other'
])

const ethnicityOptions = labelize([
  'Hispanic/Latino',
  'Not Hispanic/Latino',
  'Decline to state'
])

const raceOptions = labelize([
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
  'Decline to state'
])

const sexualOrientationOptions = labelize([
  'Bisexual',
  'Gay/Lesbian/Same-Gender Loving',
  'Questioning/Unsure',
  'Straight/Heterosexual',
  'Not listed',
  'Decline to state'
])

const preferenceProofOptionsDefault = labelize([
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

const preferenceProofOptionsLiveSf = labelize([
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

const preferenceProofOptionsWorkSf = labelize([
  'Letter from employer',
  'Paystub with employer address'
])

const preferenceProofOptionsRentBurden = labelize([
  'Money order',
  'Cancelled check',
  'Debit from your bank account',
  'Screenshot of online payment'
])

const preferenceProofOptionsNrhp = labelize([
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

const preferenceProofOptionsWorkInSf = labelize([
  'Paystub with employer address',
  'Letter from employer'
])

const priorityOptions = [
  'Mobility impaired',
  'Vision impaired',
  'Hearing impaired'
]

const listingReferralOptions = labelize([
  'Newspaper',
  'MOHCD Website',
  'Developer Website',
  'Flyer',
  'Email Alert',
  'Friend',
  'Housing Counselor',
  'Radio Ad',
  'Bus Ad',
  'Other'
])

const adaPriorityValueToLabelMap = {
  mobility_impaired: 'Mobility impaired',
  vision_impaired: 'Vision impaired',
  hearing_impaired: 'Hearing impaired'
}

const yesNoOptions = labelize([
  'Yes',
  'No',
  'Left Blank'
])

export default {
  applicationLanguageOptions,
  phoneTypeOptions,
  alternateContactOptions,
  genderOptions,
  sexAtBirthOptions,
  relationshipOptions,
  ethnicityOptions,
  raceOptions,
  sexualOrientationOptions,
  preferenceProofOptionsDefault,
  preferenceProofOptionsLiveSf,
  preferenceProofOptionsWorkSf,
  preferenceProofOptionsRentBurden,
  preferenceProofOptionsNrhp,
  preferenceProofOptionsWorkInSf,
  priorityOptions,
  listingReferralOptions,
  yesNoOptions,
  adaPriorityValueToLabelMap
}
