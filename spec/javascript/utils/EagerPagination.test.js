import EagerPagination from 'utils/EagerPagination'
import _ from 'lodash'

describe('EagerPagination', () => {
  describe('getServerPageForEagerPage', () => {
    test('it should return the right server page for the eager page', () => {
      const fetchPage = (page) => _.range(100)
      const eagerPagination = new EagerPagination(20, 100, fetchPage)

      expect(eagerPagination.getServerPageForEagerPage(1)).toEqual(1)
      expect(eagerPagination.getServerPageForEagerPage(2)).toEqual(1)
      expect(eagerPagination.getServerPageForEagerPage(3)).toEqual(1)
      expect(eagerPagination.getServerPageForEagerPage(4)).toEqual(1)
      expect(eagerPagination.getServerPageForEagerPage(5)).toEqual(1)

      expect(eagerPagination.getServerPageForEagerPage(6)).toEqual(2)
      expect(eagerPagination.getServerPageForEagerPage(7)).toEqual(2)
      expect(eagerPagination.getServerPageForEagerPage(8)).toEqual(2)
      expect(eagerPagination.getServerPageForEagerPage(9)).toEqual(2)
      expect(eagerPagination.getServerPageForEagerPage(10)).toEqual(2)

      expect(eagerPagination.getServerPageForEagerPage(11)).toEqual(3)
    })


    test('it should fetch when needed', async () => {
      const mockFetchPage = jest.fn();
      mockFetchPage
        .mockReturnValueOnce({ records: _.range(0, 100), pages: 100 })
        .mockReturnValueOnce({ records: _.range(100, 200), pages: 100 })

      const fetchData = async (page) => {
        console.log('called')
        return mockFetchPage()
      }

      const eagerPagination = new EagerPagination(20, 100, fetchData)

      const r1 = await eagerPagination.getPage(1)
      const r2 = await eagerPagination.getPage(2)
      const r3 = await eagerPagination.getPage(6)
      expect(mockFetchPage.mock.calls.length).toBe(2);
      expect(r1.records.length).toEqual(20)
      expect(r2.records.length).toEqual(20)
      expect(r3.records.length).toEqual(20)

      console.log(JSON.stringify(r1))
      console.log(JSON.stringify(r2))
      console.log(JSON.stringify(r3))
    })
  })
})
