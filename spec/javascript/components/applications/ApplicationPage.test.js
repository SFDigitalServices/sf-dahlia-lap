import { screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

import application from '../../fixtures/application'
import saleApplication from '../../fixtures/sale_application'
import { renderAppWithUrl } from '../../testUtils/wrapperUtil'

const FLAGGED_APP_ID = 'flagged_app_id'
const NO_FLAGS_ID = 'no_flags_id'
const SALE_APP_ID = 'sale_app_id'
const REGULAR_APP_ID = 'regular_app_id'

const mockGetShortFormApplication = jest.fn()

const tick = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}

jest.mock('apiService', () => {
  const FLAGGED_APP_ID = 'flagged_app_id'
  const NO_FLAGS_ID = 'no_flags_id'
  const SALE_APP_ID = 'sale_app_id'
  return {
    getShortFormApplication: async (id) => {
      mockGetShortFormApplication(id)
      let responseApp
      if (id === FLAGGED_APP_ID) {
        responseApp = {
          ...mockApplication,
          flagged_applications: [
            {
              flagged_record: {
                id: 'a0r0P00002X4r08QAB',
                rule_name: 'Name + DOB',
                total_number_of_pending_review: 51
              }
            }
          ]
        }
      } else if (id === SALE_APP_ID) {
        responseApp = { ...mockSaleApplication }
      } else if (id === NO_FLAGS_ID) {
        responseApp = { ...mockApplication, flagged_applications: [] }
      } else {
        responseApp = { ...mockApplication }
      }

      return Promise.resolve({ application: responseApp, fileBaseUrl: 'test_file_url' })
    }
  }
})

// we need to define these separate from the import so we can use them in the
// jest block.
const mockApplication = application
const mockSaleApplication = saleApplication

const renderApp = async ({ applicationId, waitForLoadingFinish = false, queryParams = '' }) => {
  const url = `/applications/${applicationId}${queryParams}`

  // have to wrap in await act so that all useEffectOnMount updates finish.
  await act(async () => {
    renderAppWithUrl(url)
  })

  if (waitForLoadingFinish) {
    await act(tick)
  }
}

describe('ApplicationPage', () => {
  describe('with regular application', () => {
    const appId = REGULAR_APP_ID
    describe('before application is loaded', () => {
      beforeEach(async () => {
        await renderApp({ applicationId: appId })
      })

      test('called getShortFormApplication', () => {
        expect(mockGetShortFormApplication.mock.calls).toHaveLength(1)
        expect(mockGetShortFormApplication.mock.calls[0][0]).toEqual(REGULAR_APP_ID)
      })
    })

    describe('After the application finishes loading', () => {
      beforeEach(async () => {
        await renderApp({ applicationId: appId, waitForLoadingFinish: true })
      })

      test('should no longer be loading', () => {
        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
      })

      test('renders ApplicationDetails', () => {
        expect(
          screen.getByRole('heading', {
            name: /application data/i
          })
        ).toBeInTheDocument()
      })

      test('populates the header title and content with application details', () => {
        expect(screen.getByText('Application APP-00191270')).toBeInTheDocument()

        expect(
          screen
            .getByRole('link', {
              name: /test 5\/30/i
            })
            .getAttribute('href')
        ).toBe('/listings/a0W0x000000GhJUEA0')
      })

      test('should match snapshot', async () => {
        // TODO: Expand test coverage on this page to the point that we do not need this snapshot check.
        const { asFragment } = await act(async () => {
          return new Promise((resolve) => {
            resolve(renderAppWithUrl(`/applications/${appId}`))
          })
        })
        expect(asFragment()).toMatchSnapshot()
      })
    })
  })

  describe('with sale application', () => {
    beforeEach(async () => {
      await renderApp({ applicationId: SALE_APP_ID, waitForLoadingFinish: true })
    })

    test('renders Eligibility section', async () => {
      expect(
        screen.getByRole('heading', {
          name: /application data/i
        })
      ).toBeInTheDocument()
    })

    test('renders name of lender', async () => {
      expect(screen.getByText(/jason lockhart/i)).toBeInTheDocument()
    })
  })

  describe('with application that has no flags', () => {
    beforeEach(async () => {
      await renderApp({ applicationId: NO_FLAGS_ID, waitForLoadingFinish: true })
    })

    test('does not render flagged app content card', async () => {
      expect(
        screen.queryByRole('heading', {
          name: /flagged applications/i
        })
      ).not.toBeInTheDocument()
    })
  })

  describe('with flagged application', () => {
    beforeEach(async () => {
      await renderApp({ applicationId: FLAGGED_APP_ID, waitForLoadingFinish: true })
    })

    test('renders flagged app content card', async () => {
      expect(
        screen.queryByRole('heading', {
          name: /flagged applications/i
        })
      ).toBeInTheDocument()
    })

    test('renders the correct rule name', () => {
      expect(
        screen.getByRole('cell', {
          name: /name \+ dob/i
        })
      ).toBeInTheDocument()
    })
  })

  describe('with all query params = null', () => {
    beforeEach(async () => {
      await renderApp({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true,
        queryParams: ''
      })
    })

    test('does not render the tab headers', async () => {
      expect(screen.queryByText('Supplemental Information')).not.toBeInTheDocument()
      expect(screen.queryByText('Short Form Application')).not.toBeInTheDocument()
    })

    test('does not render add button link', async () => {
      expect(screen.queryByText('Add new application')).not.toBeInTheDocument()
    })
  })

  describe('without lease-up URL', () => {
    beforeEach(async () => {
      await renderApp({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true
      })
    })

    test('does not render the tab headers', async () => {
      expect(screen.queryByText('Supplemental Information')).not.toBeInTheDocument()
      expect(screen.queryByText('Short Form Application')).not.toBeInTheDocument()
    })
  })

  describe('with showAppBtn query param = false', () => {
    beforeEach(async () => {
      await renderApp({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true,
        queryParams: '?showAddBtn=false'
      })
    })

    test('does not render add button link', async () => {
      expect(screen.queryByText('Add new application')).not.toBeInTheDocument()
    })
  })

  describe('with showAppBtn query param = true', () => {
    beforeEach(async () => {
      await renderApp({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true,
        queryParams: '?showAddBtn=true'
      })
    })

    test('renders add button link', async () => {
      expect(screen.queryByText('Add new application')).toBeInTheDocument()
    })
  })
})
