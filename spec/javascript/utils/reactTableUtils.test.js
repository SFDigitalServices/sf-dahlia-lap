import { filterMethod } from 'utils/reactTableUtils'

describe('filterMethod', () => {
  test('should filter case insensitive', async () => {
    expect(filterMethod({ id: 'name', value: 'AbC' }, { name: 'aBc' })).toEqual(['aBc'])
  })

  test('should filter without startWith', async () => {
    expect(filterMethod({ id: 'name', value: 'AbC' }, { name: '123 aBc xyz' })).toEqual(['aBc'])
  })

  test('should filter out unmatched row', async () => {
    expect(filterMethod({ id: 'name', value: '123' }, { name: '321' })).toBeNull()
  })

  test('should filter correctly when search is empty', async () => {
    expect(filterMethod({ id: 'name', value: '' }, { name: 'abc' })).not.toBeNull()
  })
})
