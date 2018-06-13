import { slice } from 'lodash'

class EagerPagination {

  constructor(eagerPageSize, serverPageSize, fetchPage) {
    this.eagerPageSize = eagerPageSize
    this.currentEagerPage = 0
    this.serverPageSize = serverPageSize
    this.currentServerPage = 0
    this.fetchPage = fetchPage
  }

  getServerPageForEagerPage(eagerPage) {
    const recordsSize = eagerPage * this.eagerPageSize
    return (Math.floor(recordsSize / (this.serverPageSize + 1)) + 1)
  }

  async getPage(eagerPage, callback) {
    this.currentEagerPage = eagerPage
    const newServerPage = this.getServerPageForEagerPage(eagerPage)

    console.log(`${newServerPage} != ${this.currentServerPage}`)
    if (newServerPage != this.currentServerPage) {
      this.currentServerPage = newServerPage
      const result = await this.fetchPage(this.currentServerPage)
      this.records = result.records
      this.pages = result.pages
    }
    const sIdx = ((this.currentEagerPage - 1) * this.eagerPageSize)
    const eIdx = ((this.currentEagerPage - 1) * this.eagerPageSize) + this.eagerPageSize

    console.log(`sIdx:${sIdx} eIdx:${eIdx}`)
    console.log(this.records.length)
    return {
      records: slice(this.records, sIdx % this.serverPageSize, eIdx % this.serverPageSize),
      pages: this.pages
    }
  }
}

export default EagerPagination
