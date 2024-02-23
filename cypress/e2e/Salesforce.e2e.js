describe('Listings', () => {
  it('should call GET /listings with a 200 response"', () => {
    cy.visit('http://localhost:3000/')
    cy.intercept('GET', 'api/v1/lease-ups/listings').as('listings')
    cy.login()
    cy.wait('@listings').should(({ request, response }) => {
      expect(request.url).matches(/\/listings$/)
      expect(request.method).equal('GET')
      expect(response.statusCode).equal(200)
      expect(response.body).has.key('listings')

      expect(response.headers).includes({
        'cache-control': 'max-age=0, private, must-revalidate',
        'content-type': 'application/json; charset=utf-8'
      })
    })
  })

  it('should call GET /listings/a0W0P00000HbwpUUAR with a 200 response', () => {
    cy.visit('http://localhost:3000/')
    cy.intercept('GET', 'api/v1/lease-ups/listings').as('listings')
    cy.login()
    cy.wait('@listings')
    cy.intercept('GET', 'api/v1/lease-ups/listings/**').as('listing')
    // @todo: mock create listing and get the id from that
    cy.visit('http://localhost:3000/lease-ups/listings/a0W0P00000HbwpUUAR')
    cy.wait('@listing').should(({ request, response }) => {
      expect(request.url).matches(/\/listings\/a0W0P00000HbwpUUAR$/)
      expect(request.method).equal('GET')
      expect(response.statusCode).equal(200)
      expect(response.body).has.key('listing')

      expect(response.headers).includes({
        'cache-control': 'max-age=0, private, must-revalidate',
        'content-type': 'application/json; charset=utf-8'
      })
    })
  })

  it('should call GET /applications with a 200 response', () => {
    cy.visit('http://localhost:3000/')
    cy.intercept('GET', 'api/v1/lease-ups/listings').as('listings')
    cy.login()
    cy.wait('@listings')
    cy.intercept('GET', 'api/v1/applications**').as('applications')
    cy.visit('http://localhost:3000/applications')
    cy.wait('@applications').should(({ request, response }) => {
      expect(request.url).matches(/\/applications\?page=0$/)
      expect(request.method).equal('GET')
      expect(response.statusCode).equal(200)
      expect(response.body).has.ownProperty('records')
      expect(response.body).has.ownProperty('pages')
      expect(response.body).has.ownProperty('page')
      expect(response.body).has.ownProperty('total_size')
      expect(response.headers).includes({
        'cache-control': 'max-age=0, private, must-revalidate',
        'content-type': 'application/json; charset=utf-8'
      })
    })
  })
})
