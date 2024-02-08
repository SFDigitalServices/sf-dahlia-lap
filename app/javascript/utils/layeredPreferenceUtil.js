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

    const nonVetConfirmation = preferences.filter(
      (data) =>
        data.application_id === preference.application_id &&
        data.preference_record_type === preference.preference_record_type &&
        data.preference_name !== preference.preference_name
    )[0].post_lottery_validation

    let finalConfirmation = 'Unconfirmed'
    if (preference.post_lottery_validation === 'Invalid' || nonVetConfirmation === 'Invalid') {
      finalConfirmation = 'Invalid'
    } else if (
      preference.post_lottery_validation === 'Confirmed' &&
      nonVetConfirmation === 'Confirmed'
    ) {
      finalConfirmation = 'Confirmed'
    }

    return {
      ...preference,
      layered_validation: finalConfirmation
    }
  })
}
