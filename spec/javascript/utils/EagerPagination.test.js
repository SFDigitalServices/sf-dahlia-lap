import { EagerPagination } from 'utils/EagerPagination'
import { each, range } from 'lodash'

describe('EagerPagination', () => {
  describe('getServerPageForEagerPage', () => {
    test('it should return the right server page for the eager page', () => {
      const eagerPagination = new EagerPagination(20, 100)

      each(range(0, 5), (v) => {
        expect(eagerPagination.getServerPageForEagerPage(v)).toEqual(0)
      })
      each(range(5, 10), (v) => {
        expect(eagerPagination.getServerPageForEagerPage(v)).toEqual(1)
      })
      expect(eagerPagination.getServerPageForEagerPage(11)).toEqual(2)
    })

    test('it should fetch when needed', async () => {
      const mockFetchPage = jest.fn()
      mockFetchPage
        .mockReturnValueOnce({ records: range(0, 20), pages: 4 })
        .mockReturnValueOnce({ records: range(20, 40), pages: 4 })
        .mockReturnValueOnce({ records: range(40, 60), pages: 4 })

      const fetchData = async (page) => {
        return mockFetchPage(page)
      }

      const eagerPagination = new EagerPagination(5, 20)

      const pages = []
      pages.push(await eagerPagination.getPage(0, fetchData))
      pages.push(await eagerPagination.getPage(1, fetchData))
      pages.push(await eagerPagination.getPage(2, fetchData))
      pages.push(await eagerPagination.getPage(3, fetchData))
      pages.push(await eagerPagination.getPage(4, fetchData))
      pages.push(await eagerPagination.getPage(5, fetchData))
      pages.push(await eagerPagination.getPage(6, fetchData))
      pages.push(await eagerPagination.getPage(7, fetchData))
      pages.push(await eagerPagination.getPage(8, fetchData))
      pages.push(await eagerPagination.getPage(9, fetchData))
      pages.push(await eagerPagination.getPage(10, fetchData))

      expect(mockFetchPage.mock.calls).toHaveLength(3)
      expect(mockFetchPage.mock.calls[0][0]).toBe(0)
      expect(mockFetchPage.mock.calls[1][0]).toBe(1)

      each(pages, (p) => {
        expect(p.records).toHaveLength(5)
      })

      expect(pages[0].records).toEqual(range(0, 5))
      expect(pages[1].records).toEqual(range(5, 10))
      expect(pages[2].records).toEqual(range(10, 15))
      expect(pages[3].records).toEqual(range(15, 20))
      expect(pages[4].records).toEqual(range(20, 25))
      expect(pages[5].records).toEqual(range(25, 30))
      expect(pages[6].records).toEqual(range(30, 35))
      expect(pages[7].records).toEqual(range(35, 40))
      expect(pages[8].records).toEqual(range(40, 45))
      expect(pages[9].records).toEqual(range(45, 50))
      expect(pages[10].records).toEqual(range(50, 55))
    })
  })
})
