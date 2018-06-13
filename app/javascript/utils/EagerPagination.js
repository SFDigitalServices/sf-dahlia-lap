
class EagerPagination {

  constructor(eagerPageSize, fetchPage) {
    this.eagerPageSize = eagerPageSize
    this.currentEagerPage = 1
    this.fetchPage = fetchPage
    this.serverRecordsSize = 0
    this.currentServerPage = 0
  }

  loadPage(eagerPage, callback) {
    this.currentEagerPage = eagerPage

    if ((this.eagerPage * this.eagerPageSize) > this.serverRecordsSize) {
      this.currentServerPage = 1

      this.fetchPage(this.currentServerPage).then(({ records, pages}) => {
        // console.log('fetchPage')
        // console.log(response)
        this.records = records
        callback(records, pages)
        this.serverRecordsSize = records.size
      })
    } else {

    }
  }
}

export default EagerPagination
