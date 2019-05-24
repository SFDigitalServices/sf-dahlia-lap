import formOptions from 'components/applications/application_form/formOptions'
const {
  labelize
} = formOptions
const emptyOption = { label: 'Select One...', value: '' }

describe('labelize', () => {
  describe('when an array of strings is provided', () => {
    test('retruns empty array for no options', () => {
      expect(labelize([])).toEqual([])
    })
    test('returns objects with label and value', () => {
      expect(labelize(['test'])).toEqual([emptyOption, { label: 'test', value: 'test' }])
    })
    test('adds empty value on the first position', () => {
      expect(labelize(['test'])[0].value).toEqual('')
    })
    test('disables first option', () => {
      expect(labelize(['test'], { disableEmpty: true })[0].disabled).toEqual('disabled')
    })
  })
  describe('when an array of objects is provided', () => {
    test('retruns array of options', () => {
      const option = { value: 'test', label: 'test' }
      expect(labelize([option])[1]).toEqual(option)
    })
    test('adds an empty option', () => {
      const option = { value: 'test', label: 'test' }
      expect(labelize([option])[0]).toEqual(emptyOption)
    })
  })
})
