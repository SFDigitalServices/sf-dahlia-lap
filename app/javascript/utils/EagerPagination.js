import { slice } from 'lodash'

const getServerPageForEagerPage = (eagerPage, eagerSize, serverSize) => {
  const recordsSize = eagerPage * eagerSize
  return Math.floor(recordsSize / serverSize)
}

const sliceRecords = (records, eagerCurrentPage, eagerSize, serverSize) => {
  const sIdx = ((eagerCurrentPage) * eagerSize) % serverSize
  const eIdx = sIdx + eagerSize

  return slice(records, sIdx, eIdx)
}

class EagerPagination {

  constructor(eagerPageSize, serverPageSize, fetchPage) {
    this.eager = { currentPage: -1, size: eagerPageSize }
    this.server = { currentPage: -1, size: serverPageSize }
    this.fetchPage = fetchPage
  }

  reset() {
    // Setting this to -1, forces getPage to fetch
    this.eager.currentPage = -1
    this.server.currentPage = -1
  }

  buildResponse() {
    return {
      records: sliceRecords(this.records, this.eager.currentPage, this.eager.size, this.server.size),
      pages: this.pages,
      currentPage: this.eager.currentPage
    }
  }

  getServerPageForEagerPage(page) {
    return getServerPageForEagerPage(page, this.eager.size, this.server.size)
  }

  async getPage(eagerPage, options = {}) {
    this.eager.currentPage = eagerPage
    const newServerPage = this.getServerPageForEagerPage(eagerPage)
    // console.log(eagerPage, this.server.currentPage, newServerPage)
    if (newServerPage !== this.server.currentPage) {
      this.server.currentPage = newServerPage
      const result = await this.fetchPage(this.server.currentPage, options)
      this.records = result.records
      this.pages = (result.pages * result.records.length) / this.eager.size
    }

    return this.buildResponse()
  }

}

export default EagerPagination
