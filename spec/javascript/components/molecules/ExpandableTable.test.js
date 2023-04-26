import React from 'react'

import { mount } from 'enzyme'

import ExpandableTable from 'components/molecules/ExpandableTable'

const mockColumns = [{ content: 'id' }, { content: 'name' }]

const mockRows = [
  [{ content: 'id1' }, { content: 'name1' }],
  [{ content: 'id2' }, { content: 'name2' }],
  [{ content: 'id3' }, { content: 'name3' }]
]

const getWrapper = (expandedIndices) =>
  mount(
    <ExpandableTable
      columns={mockColumns}
      rows={mockRows}
      expandedRowIndices={expandedIndices}
      renderRow={(_, row) => <div className='testRow'>{row[0].content}</div>}
      renderExpanderButton={(_, row) => <div className='testExpanderButton'>{row[0].content}</div>}
    />
  )

describe('ExpandableTable', () => {
  describe('when no rows are expanded', () => {
    test('it renders properly', () => {
      const wrapper = getWrapper(new Set())
      expect(
        wrapper.find('ExpandableTableRow').map((rowWrapper) => rowWrapper.props().expanded)
      ).toEqual([false, false, false])
      expect(wrapper.find('div.testExpanderButton')).toHaveLength(3)
    })
  })

  describe('when one row is expanded', () => {
    test('it renders properly', () => {
      const wrapper = getWrapper(new Set([0]))
      expect(
        wrapper.find('ExpandableTableRow').map((rowWrapper) => rowWrapper.props().expanded)
      ).toEqual([true, false, false])
      expect(wrapper.find('div.testRow').first().text()).toEqual('id1')
      expect(wrapper.find('div.testExpanderButton')).toHaveLength(3)
    })
  })

  describe('when all rows expanded', () => {
    test('it renders properly', () => {
      const wrapper = getWrapper(new Set([0, 1, 2]))
      expect(
        wrapper.find('ExpandableTableRow').map((rowWrapper) => rowWrapper.props().expanded)
      ).toEqual([true, true, true])
      expect(wrapper.find('div.testExpanderButton')).toHaveLength(3)
    })
  })
})
