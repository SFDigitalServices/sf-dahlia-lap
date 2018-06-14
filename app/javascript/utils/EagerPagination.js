import { slice } from 'lodash'

class EagerPagination {

  constructor(eagerPageSize, serverPageSize, fetchPage) {
    this.eager = { currentPage: 0, size: eagerPageSize }
    this.server = { currentPage: 0, size: serverPageSize }
    this.fetchPage = async (p) => fetchPage(p)
  }

  getServerPageForEagerPage(eagerPage) {
    const recordsSize = eagerPage * this.eager.size
    return (Math.floor(recordsSize / (this.server.size + 1)) + 1)
  }

  async getPage(eagerPage) {
    this.eager.currentPage = eagerPage
    const newServerPage = this.getServerPageForEagerPage(eagerPage)
    if (newServerPage != this.server.currentPage) {
      this.server.currentPage = newServerPage
      const result = await this.fetchPage(this.server.currentPage)
      this.records = result.records
      this.pages = (result.pages * result.records.length) / this.eager.size
    }
    const sIdx = ((this.eager.currentPage - 1) * this.eager.size) % this.server.size
    const eIdx = sIdx + this.eager.size

    return {
      records: slice(this.records, sIdx, eIdx),
      pages: this.pages,
      currentPage: this.eager.currentPage
    }
  }
}

export default EagerPagination
