import { memberNameFromPref } from 'components/applications/application_form/preferences/utils'
import { getTypeOfProof } from 'components/supplemental_application/sections/preferences/typeOfProof'

export const isVeteran = (preferenceName) => preferenceName && preferenceName.includes('Veteran')

/**
 * addLayeredValidation goes through a list of preferences to set a final layered_validation
 * 1. non-veteran preferences only consider themselves for the final layered_validation
 * 2. veteran preferences look for their counterpart non-veteran preference when setting the final layered_validation
 */
export const addLayeredValidation = (preferences) => {
  return preferences.map((preference) => {
    if (!isVeteran(preference.preference_name)) {
      return {
        ...preference,
        layered_validation: preference.post_lottery_validation
      }
    }

    const filteredPrefs = preferences.filter(
      (data) =>
        data.application_id === preference.application_id &&
        data.preference_record_type === preference.preference_record_type &&
        data.preference_name !== preference.preference_name
    )

    let nonVetConfirmation
    if (filteredPrefs.length < 1) {
      console.warn(
        `matching non vet preference not found, falling back to unconfirmed status for veteran preference`
      )
      nonVetConfirmation = 'Unconfirmed'
    } else {
      nonVetConfirmation = filteredPrefs[0].post_lottery_validation
    }

    const finalConfirmation = calculateFinalConfirmation(
      preference.post_lottery_validation === 'Invalid'
        ? preference.post_lottery_validation
        : preference.lottery_status,
      nonVetConfirmation
    )

    return {
      ...preference,
      layered_validation: finalConfirmation
    }
  })
}

/**
 * addLayeredPreferenceFields goes through a list of preferences to set several layered preference fields
 * 1. non-veteran preferences only consider themselves for these layered preference fields
 * 2. veteran preferences look for their counterpart non-veteran preference when setting these fields
 */
export const addLayeredPreferenceFields = (
  preferences,
  proofFiles,
  fileBaseUrl,
  applicationMembers
) => {
  return preferences.map((preference, index) => {
    if (!isVeteran(preference.preference_name)) {
      return {
        ...preference,
        layered_validation: preference.post_lottery_validation,
        layered_type_of_proofs: [getTypeOfProof(preference, proofFiles, fileBaseUrl)],
        layered_member_names: [
          memberNameFromPref(preference.application_member_id, applicationMembers)
        ]
      }
    }

    const nonVetPreference = preferences[index + 1]

    const finalConfirmation = calculateFinalConfirmation(
      preference.post_lottery_validation === 'Invalid'
        ? preference.post_lottery_validation
        : preference.lottery_status,
      nonVetPreference.post_lottery_validation
    )

    const vetTypeOfProof = getTypeOfProof(preference, proofFiles, fileBaseUrl)
    const nonVetTypeOfProof = getTypeOfProof(nonVetPreference, proofFiles, fileBaseUrl)

    const vetMemberName = memberNameFromPref(preference.application_member_id, applicationMembers)
    const nonVetMemberName = memberNameFromPref(
      nonVetPreference.application_member_id,
      applicationMembers
    )
    // we only want to display unique member names
    // if vet and non vet member names are the same only display it once
    const uniqueMemberNames = new Set([vetMemberName, nonVetMemberName])

    return {
      ...preference,
      layered_validation: finalConfirmation,
      layered_type_of_proofs: [vetTypeOfProof, nonVetTypeOfProof],
      layered_member_names: [...uniqueMemberNames]
    }
  })
}

const calculateFinalConfirmation = (first_confirmation, second_confirmation) => {
  if (first_confirmation === 'Invalid' || second_confirmation === 'Invalid') {
    return 'Invalid'
  } else if (second_confirmation === 'Unconfirmed') {
    return 'Unconfirmed'
  } else if (first_confirmation === 'Valid for lottery') {
    return 'Confirmed'
  }
}
