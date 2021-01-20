import { slice } from 'lodash'

// Note: This needs to match the page size defined on the server in soql_query_builder.rb.
const SERVER_PAGE_SIZE = 100

const MAX_SERVER_LIMIT = 2100

const getServerPageForEagerPage = (eagerCurrentPage, eagerSize, serverSize) => {
  const recordsSize = eagerCurrentPage * eagerSize
  return Math.floor(recordsSize / serverSize)
}

const sliceRecords = (records, eagerCurrentPage, eagerSize, serverSize) => {
  const sIdx = (eagerCurrentPage * eagerSize) % serverSize
  const eIdx = sIdx + eagerSize

  return slice(records, sIdx, eIdx)
}

class EagerPagination {
  constructor(eagerPageSize, serverPageSize) {
    this.eager = { currentPage: -1, size: eagerPageSize }
    this.server = { currentPage: -1, size: serverPageSize }
  }

  reset() {
    this.eager.currentPage = -1
    this.server.currentPage = -1
  }

  isOverLimit(page) {
    return page * this.eager.size >= MAX_SERVER_LIMIT
  }

  buildResponse() {
    return {
      records: sliceRecords(
        this.records,
        this.eager.currentPage,
        this.eager.size,
        this.server.size
      ),
      pages: this.pages,
      currentPage: this.eager.currentPage
    }
  }

  getServerPageForEagerPage(page) {
    return getServerPageForEagerPage(page, this.eager.size, this.server.size)
  }

  // /**
  //  * Update all record data. Useful when you make a change that may affect records on other pages and you need
  //  * the changes to be visible when the
  //  * @param {(record) => record} recordMapperFn function that modifies a record and returns the result.
  //  */
  // mapRecords(recordMapperFn) {}

  /**
   * @param {number} eagerPage page number to fetch
   * @param {() => { records, pages }} fetchPage function to fetch the new server page
   * @param {*} forceRefresh true if the records should be refreshed even if they
   *   exist on the server.
   */
  async getPage(eagerPage, fetchPage, forceRefresh = false) {
    this.eager.currentPage = eagerPage
    const newServerPage = this.getServerPageForEagerPage(eagerPage)
    if (forceRefresh || newServerPage !== this.server.currentPage) {
      this.server.currentPage = newServerPage
      const result = await fetchPage(this.server.currentPage)
      this.records = result.records
      const totalNumberOfApplications = result.pages * this.server.size
      this.pages = Math.ceil(totalNumberOfApplications / this.eager.size)
    }

    return this.buildResponse()
  }
}

export { EagerPagination, SERVER_PAGE_SIZE, MAX_SERVER_LIMIT }
