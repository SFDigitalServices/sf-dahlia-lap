import {
  isLeaseValid,
  isSingleRentalAssistanceValid,
  areAllRentalAssistancesValid,
  areLeaseAndRentalAssistancesValid
} from 'utils/form/formSectionValidations'

const ERROR = {
  message: 'error message'
}

const NO_ERROR = {}

const mockFormErrors = ({ assistanceErrors, leaseErrors }) => ({
  getState: () => ({
    errors: {
      rental_assistances: assistanceErrors,
      lease: leaseErrors
    }
  })
})

const mockFormWithAssistanceErrors = (errors) => mockFormErrors({ assistanceErrors: errors })

describe('isLeaseValid', () => {
  test('should return true with empty errors', () => {
    expect(isLeaseValid(mockFormErrors({ leaseErrors: undefined }))).toBeTruthy()
    expect(isLeaseValid(mockFormErrors({ leaseErrors: {} }))).toBeTruthy()
  })

  test('should return false with non-empty errors', () => {
    expect(isLeaseValid(mockFormErrors({ leaseErrors: ERROR }))).toBeFalsy()
    expect(isLeaseValid(mockFormErrors({ leaseErrors: { lease_start_date: ERROR } }))).toBeFalsy()
    expect(
      isLeaseValid(mockFormErrors({ leaseErrors: { lease_start_date: { all: ERROR } } }))
    ).toBeFalsy()
  })
})

describe('isSingleRentalAssistanceValid', () => {
  test('should return true when rental assistance errors are null', () => {
    const form = mockFormWithAssistanceErrors(undefined)
    expect(isSingleRentalAssistanceValid(form, 0)).toBeTruthy()
  })

  test('should return true when rental assistance errors are empty', () => {
    const form = mockFormWithAssistanceErrors([])
    expect(isSingleRentalAssistanceValid(form, 0)).toBeTruthy()
  })

  test('should return true when the assistance at that index is empty', () => {
    const form = mockFormWithAssistanceErrors([NO_ERROR, ERROR])
    expect(isSingleRentalAssistanceValid(form, 0)).toBeTruthy()
  })

  test('should return false when the assistance at that index is not empty', () => {
    const form = mockFormWithAssistanceErrors([NO_ERROR, ERROR])
    expect(isSingleRentalAssistanceValid(form, 1)).toBeFalsy()
  })
})

describe('areAllRentalAssistancesValid', () => {
  test('should return true when rental assistance errors are null', () => {
    const form = mockFormWithAssistanceErrors(undefined)
    expect(areAllRentalAssistancesValid(form)).toBeTruthy()
  })

  test('should return true when rental assistance errors are empty', () => {
    const form = mockFormWithAssistanceErrors([])
    expect(areAllRentalAssistancesValid(form)).toBeTruthy()
  })

  test('should return true with a single valid assistance', () => {
    const form = mockFormWithAssistanceErrors([NO_ERROR])
    expect(areAllRentalAssistancesValid(form)).toBeTruthy()
  })

  test('should return true with multiple valid assistances', () => {
    const form = mockFormWithAssistanceErrors([NO_ERROR, NO_ERROR])
    expect(areAllRentalAssistancesValid(form)).toBeTruthy()
  })

  test('should return false with a single invalid assistance', () => {
    const form = mockFormWithAssistanceErrors([ERROR])
    expect(areAllRentalAssistancesValid(form)).toBeFalsy()
  })

  test('should return false with multiple invalid assistance', () => {
    const form = mockFormWithAssistanceErrors([ERROR, ERROR])
    expect(areAllRentalAssistancesValid(form)).toBeFalsy()
  })

  test('should return false with a mix of valid and invalid assistances', () => {
    let form = mockFormWithAssistanceErrors([NO_ERROR, NO_ERROR, ERROR])
    expect(areAllRentalAssistancesValid(form)).toBeFalsy()

    form = mockFormWithAssistanceErrors([ERROR, NO_ERROR, NO_ERROR])
    expect(areAllRentalAssistancesValid(form)).toBeFalsy()
  })
})

describe('areLeaseAndRentalAssistancesValid', () => {
  const getResult = (assistanceErrors, leaseErrors) => {
    const form = mockFormErrors({
      assistanceErrors: assistanceErrors,
      leaseErrors: leaseErrors
    })

    return areLeaseAndRentalAssistancesValid(form)
  }

  describe('with undefined rental assistances', () => {
    const assistanceErrors = undefined

    test('should return true when lease errors are undefined', () => {
      const leaseErrors = undefined
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeTruthy()
    })

    test('should return true when lease has no errors', () => {
      const leaseErrors = NO_ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeTruthy()
    })

    test('should return false when lease has errors', () => {
      const leaseErrors = ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeFalsy()
    })
  })

  describe('with empty rental assistances', () => {
    const assistanceErrors = []

    test('should return true when lease errors are undefined', () => {
      const leaseErrors = undefined
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeTruthy()
    })

    test('should return true when lease has no errors', () => {
      const leaseErrors = NO_ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeTruthy()
    })

    test('should return false when lease has errors', () => {
      const leaseErrors = ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeFalsy()
    })
  })

  describe('with valid rental assistances', () => {
    const assistanceErrors = [NO_ERROR, NO_ERROR, NO_ERROR]

    test('should return true when lease errors are undefined', () => {
      const leaseErrors = undefined
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeTruthy()
    })

    test('should return true when lease has no errors', () => {
      const leaseErrors = NO_ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeTruthy()
    })

    test('should return false when lease has errors', () => {
      const leaseErrors = ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeFalsy()
    })
  })

  describe('with invalid rental assistances', () => {
    const assistanceErrors = [ERROR, ERROR, NO_ERROR]

    test('should return false when lease errors are undefined', () => {
      const leaseErrors = undefined
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeFalsy()
    })

    test('should return false when lease has no errors', () => {
      const leaseErrors = NO_ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeFalsy()
    })

    test('should return false when lease has errors', () => {
      const leaseErrors = ERROR
      const result = getResult(assistanceErrors, leaseErrors)
      expect(result).toBeFalsy()
    })
  })
})
