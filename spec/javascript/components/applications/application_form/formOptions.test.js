import formOptions from 'components/applications/application_form/formOptions'
const { labelize } = formOptions
const emptyOption = { label: 'Select One...', value: '' }

describe('labelize', () => {
  describe('when an array of strings is provided', () => {
    test('returns empty array for no options', () => {
      expect(labelize([])).toEqual([])
    })
    test('returns objects with label and value', () => {
      expect(labelize(['test'])).toEqual([emptyOption, { label: 'test', value: 'test' }])
    })
    test('adds empty value on the first position', () => {
      expect(labelize(['test'])[0].value).toBe('')
    })
    test('disables first option', () => {
      expect(labelize(['test'], { disableEmpty: true })[0].disabled).toBe('disabled')
    })
  })
  describe('when an array of objects is provided', () => {
    test('returns array of options', () => {
      const option = { value: 'test', label: 'test' }
      expect(labelize([option])[1]).toEqual(option)
    })
    test('adds an empty option', () => {
      const option = { value: 'test', label: 'test' }
      expect(labelize([option])[0]).toEqual(emptyOption)
    })
    test('does not add an empty option with empty value', () => {
      const option = { value: '', label: 'test' }
      expect(labelize([option])[0]).toEqual(option)
    })
    test('does not add an empty option with first option as empty string', () => {
      const option = ''
      expect(labelize([option])[0]).toEqual({ value: '', label: '' })
    })
  })
  describe('when all or part of an option is null', () => {
    test('it keeps label as null', () => {
      const option = { value: 'test', label: null }
      expect(labelize([option], {})[1]).toEqual(option)
    })
    test('it keeps value as null', () => {
      const option = { value: null, label: 'label' }
      expect(labelize([option], {})[0]).toEqual(option)
    })
  })
})
