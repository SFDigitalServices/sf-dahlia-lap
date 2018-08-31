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
      this.pages = (result.pages * result.records.length) / this.eager.size
    }

    return this.buildResponse()
  }
}

export default EagerPagination
