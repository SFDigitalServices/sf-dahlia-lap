/* global mount */
import React from 'react'
import renderer from 'react-test-renderer'
import IndexTable from 'components/IndexTable'

// A bit verbose, but just to ilustrate how it works
describe('IndexIndexTable', () => {
  const results = [
    { first_name: 'xxx1', last_name: 'zzz1' },
    { first_name: 'xxx2', last_name: 'zzz2' }
  ]

  const emptyResults = [
    {first_name: undefined, last_name: undefined, lottery_date: undefined}
  ]

  const fields = { 'first_name': null, 'last_name': null }

  const fieldsForEmptyResults = { 'first_name': null, 'last_name': null, 'lottery_date': null }

  // Jest Snapshot
  test('Should render IndexTable', () => {
    const component = renderer.create(
      <IndexTable results={results} fields={fields} />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('Should render Empty string if values are undefined', () => {
    const component = renderer.create(
      <IndexTable results={emptyResults} fields={fieldsForEmptyResults} />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  // Enzyme-Jest Snapshot
  test('Should render IndexTable', () => {
    // Mount renders the whole component tree. Mount is good for testing interactions.
    const wrapper = mount(
      <IndexTable results={results} fields={fields} linls={['View Listing']} />
    )

    // Take snapshot and save it
    expect(wrapper).toMatchSnapshot() // no need to convert to JSON when using Enzyme wrappers

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
