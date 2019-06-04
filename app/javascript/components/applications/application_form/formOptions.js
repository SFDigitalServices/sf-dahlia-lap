import _ from 'lodash'

const labelize = (options, attrs = {}) => {
  if (_.isEmpty(options)) return []

  let emptyInitialOptionPresent =
    _.isEmpty(options[0]) ||
    (options[0].hasOwnProperty('value') && _.isEmpty(options[0].value))

  let labelizedOptions = []
  if (!emptyInitialOptionPresent) {
    const initialValues = {'value': '', 'label': 'Select One...'}
    if (attrs && attrs['disableEmpty']) {
      initialValues['disabled'] = 'disabled'
    }
    labelizedOptions.push(initialValues)
  }

  return labelizedOptions.concat(
    _.map(options, (option) => (
      {
        value: option.hasOwnProperty('value') ? option.value : option,
        label: option.label || option,
        disabled: option.disabled
      }
    ))
  )
}

// TODO: Remove the use of labelize on all the below options arrays once the
// migration to react-final-form is complete. labelize is already being called
// by the new react-final-form-based SelectField component.
const applicationLanguageOptions = labelize([
  'English',
  'Chinese',
  'Spanish',
  'Filipino'
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
  'Mobility impairments',
  'Vision impairments',
  'Hearing impairments'
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

const householdVouchersSubsidiesOptions = labelize([
  {value: 'true', label: 'True'},
  {value: 'false', label: 'False'},
  'Left Blank'
])

const adaPriorityValueToLabelMap = {
  mobility_impairments: 'Mobility impairments',
  vision_impairments: 'Vision impairments',
  hearing_impairments: 'Hearing impairments'
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
  householdVouchersSubsidiesOptions,
  yesNoOptions,
  adaPriorityValueToLabelMap,
  labelize
}
