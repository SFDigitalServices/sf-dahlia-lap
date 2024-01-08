describe('Login/Logout', () => {
  it('lead header loads correctly', async () => {
    cy.visit('http://localhost:3000/')

    cy.findByText('Welcome to DAHLIA Partners.').should('exist')
  })

  it('should sign out successfully', async () => {
    cy.visit('http://localhost:3000/')

    cy.login()

    cy.contains('a', 'Sign out').click()

    cy.contains('Welcome to DAHLIA Partners.')
  })
})
