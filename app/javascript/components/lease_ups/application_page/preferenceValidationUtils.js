export const VALIDATION_CONFIRMED = 'Confirmed'
export const VALIDATION_UNCONFIRMED = 'Unconfirmed'
export const VALIDATION_INVALID = 'Invalid'

export const isInvalidPreference = (postLotteryValidation) =>
  postLotteryValidation === VALIDATION_INVALID

export const isConfirmedPreference = (postLotteryValidation) =>
  postLotteryValidation === VALIDATION_CONFIRMED
