// TODO: add tests and comments
// TODO: immutability??

import { memberNameFromPref } from 'components/applications/application_form/preferences/utils'
import { getTypeOfProof } from 'components/supplemental_application/sections/preferences/typeOfProof'

export const isVeteran = (preferenceName) => preferenceName && preferenceName.includes('Veteran')

export const addLayeredValidation = (preferences) => {
  preferences.forEach((preference) => {
    if (!isVeteran(preference.preference_name)) {
      preference.layered_validation = preference.post_lottery_validation
      return
    }

    // TODO: first_name + last_name vs application id
    const nonVetConfirmation = preferences.filter(
      (data) =>
        data.first_name === preference.first_name &&
        data.last_name === preference.last_name &&
        data.preference_record_type === preference.preference_record_type &&
        data.preference_name !== preference.preference_name
    )[0].post_lottery_validation

    // TODO: replace string with enums
    let finalConfirmation = 'Unconfirmed'
    if (preference.post_lottery_validation === 'Invalid' || nonVetConfirmation === 'Invalid') {
      finalConfirmation = 'Invalid'
    } else if (
      preference.post_lottery_validation === 'Confirmed' &&
      nonVetConfirmation === 'Confirmed'
    ) {
      finalConfirmation = 'Confirmed'
    }
    preference.layered_validation = finalConfirmation
  })
}

// TODO: reduce duplication
export const addLayeredPreferenceFields = (
  preferences,
  proofFiles,
  fileBaseUrl,
  applicationMembers
) => {
  preferences.forEach((preference, index) => {
    if (!isVeteran(preference.preference_name)) {
      preference.layered_validation = preference.post_lottery_validation
      preference.layered_type_of_proofs = [getTypeOfProof(preference, proofFiles, fileBaseUrl)]
      preference.layered_member_names = [
        memberNameFromPref(preference.application_member_id, applicationMembers)
      ]
      return
    }

    const nonVetPref = preferences[index + 1]

    let finalConfirmation = 'Unconfirmed'
    if (
      preference.post_lottery_validation === 'Invalid' ||
      nonVetPref.post_lottery_validation === 'Invalid'
    ) {
      finalConfirmation = 'Invalid'
    } else if (
      preference.post_lottery_validation === 'Confirmed' &&
      nonVetPref.post_lottery_validation === 'Confirmed'
    ) {
      finalConfirmation = 'Confirmed'
    }

    const vetTypeOfProof = getTypeOfProof(preference, proofFiles, fileBaseUrl)
    const nonVetTypeOfProof = getTypeOfProof(nonVetPref, proofFiles, fileBaseUrl)

    const vetMemberName = memberNameFromPref(preference.application_member_id, applicationMembers)
    const nonVetMemberName = memberNameFromPref(
      nonVetPref.application_member_id,
      applicationMembers
    )

    preference.layered_validation = finalConfirmation
    preference.layered_type_of_proofs = [vetTypeOfProof, nonVetTypeOfProof]
    preference.layered_member_names = [vetMemberName, nonVetMemberName]
  })
}
