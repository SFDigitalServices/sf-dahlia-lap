/* global mount */
import React from 'react'
import renderer from 'react-test-renderer'
import IndexTable from 'components/IndexTable'

// A bit verbose, but just to illustrate how it works
describe('IndexTable', () => {
  const results = [
    { first_name: 'xxx1', last_name: 'zzz1' },
    { first_name: 'xxx2', last_name: 'zzz2' }
  ]

  const emptyResults = [
    { first_name: undefined, last_name: undefined, lottery_date: undefined }
  ]

  const fields = { first_name: null, last_name: null }

  const fieldsForEmptyResults = { first_name: null, last_name: null, lottery_date: null }

  // Jest Snapshot
  test('should render IndexTable', () => {
    const component = renderer.create(
      <IndexTable results={results} fields={fields} />
    )

    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('should render empty string if values are undefined', () => {
    const wrapper = mount(
      <IndexTable results={emptyResults} fields={fieldsForEmptyResults} />
    )

    const firstRow = wrapper.find('div.rt-tbody div.rt-tr-group').first()
    // Filter out the arrow that expands the row.
    firstRow.find('div.rt-td').not('.rt-expandable').forEach((node) => {
      // Expect all other cells to be empty
      expect(node.text()).toEqual('')
    })
  })

  // Enzyme-Jest Snapshot
  test('rows should be expandable', () => {
    // Mount renders the whole component tree. Mount is good for testing interactions.
    const wrapper = mount(
      <IndexTable results={results} fields={fields} links={['View Listing']} />
    )

    // Using Enzyme to check a property of a component. No need here, since we use snapshot.
    expect(wrapper.find('ReactTable').props().expanded['0']).toBeUndefined()

    // Simulate interaction
    wrapper.find('.rt-expander').first().simulate('click')

    // Using Enzyme to check a property of a component
    expect(wrapper.find('ReactTable').props().expanded['0']).toEqual(true)

    // Take snapshot again of new view
    expect(wrapper).toMatchSnapshot()
  })
})
