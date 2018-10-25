import { slice } from 'lodash'

const getServerPageForEagerPage = (eagerCurrentPage, eagerSize, serverSize) => {
  const recordsSize = eagerCurrentPage * eagerSize
  return Math.floor(recordsSize / serverSize)
}

const sliceRecords = (records, eagerCurrentPage, eagerSize, serverSize) => {
  const sIdx = ((eagerCurrentPage) * eagerSize) % serverSize
  const eIdx = sIdx + eagerSize

  return slice(records, sIdx, eIdx)
}

class EagerPagination {
  constructor (eagerPageSize, serverPageSize) {
    this.eager = { currentPage: -1, size: eagerPageSize }
    this.server = { currentPage: -1, size: serverPageSize }
  }

  reset () {
    this.eager.currentPage = -1
    this.server.currentPage = -1
  }

  buildResponse () {
    return {
      records: sliceRecords(this.records, this.eager.currentPage, this.eager.size, this.server.size),
      pages: this.pages,
      currentPage: this.eager.currentPage
    }
  }

  getServerPageForEagerPage (page) {
    return getServerPageForEagerPage(page, this.eager.size, this.server.size)
  }

  async getPage (eagerPage, fetchPage) {
    this.eager.currentPage = eagerPage
    const newServerPage = this.getServerPageForEagerPage(eagerPage)
    if (newServerPage !== this.server.currentPage) {
      this.server.currentPage = newServerPage
      const result = await fetchPage(this.server.currentPage)
      this.records = result.records
      let numerator = result.pages * result.records.length
      // If there is < 1 page of results from salesforce, we get pages == 0. We need to round up to 1 page.
      // TODO: Refactor this logic to avoid this step.
      if (result.pages === 0) { numerator = result.records.length }
      if (this.server.currentPage === 0) { this.pages = Math.ceil(numerator / this.eager.size) }
    }

    return this.buildResponse()
  }
}

export default EagerPagination
