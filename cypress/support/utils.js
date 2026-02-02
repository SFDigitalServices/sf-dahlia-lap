export const generateRandomString = (length) => {
  // Due to 0s potentially present in the random number,
  // there is a chance that this function could return a string shorter than the desired length.
  // Source: https://stackoverflow.com/a/38622545
  return Math.random().toString(36).substring(2, length)
}

export const generateRandomCurrency = () => {
  // Round to the nearest hundredth, then convert back to float.
  const val = Number.parseFloat((Math.random() * 1000).toFixed(2))
  // TODO: We could improve this by adding commas to the currency string too.
  return { currency: `$${val}`, float: val }
}

export const bulkActionCheckboxId = (appId) => `#bulk-action-checkbox-${appId}`

export const statusMenuItemSelector = (value) => `li.is-${value.toLowerCase()} a`

export const nthRowStatusDropdownSelector = (rowNumber) =>
  `.rt-tr-group:nth-child(${rowNumber}) .rt-td .dropdown .dropdown-button`

export const notSelectedOptionSelector = (fieldSelector) => {
  return `${fieldSelector} option:not(:checked):not(:disabled)`
}

export const selectedOptionSelector = (fieldSelector) => {
  return `${fieldSelector} option:checked`
}

export const usingFixtures = () => {
  return Cypress.env('salesforceInstanceUrl') === 'https://sfhousing.my.salesforce.com'
}

export const interceptInviteToApplyFlag = (listingId) => {
  cy.intercept('GET', 'https://dahlia-feature-service-fbc319c3f542.herokuapp.com/api/frontend**', {
    statusCode: 200,
    body: {
      toggles: [
        {
          name: 'partners.inviteToApply',
          enabled: true,
          variant: {
            payload: {
              value: listingId
            }
          }
        },
        {
          name: 'temp.partners.inviteToApply.statuses',
          enabled: true
        }
      ]
    }
  }).as('inviteToApplyFeatureFlag')
}
