import React from 'react'

import { render, screen } from '@testing-library/react'
import { MemoryRouter as Router } from 'react-router-dom'

import LeaseUpRoutes from 'routes/LeaseUpRoutes'

jest.mock(
  '../../../app/javascript/components/supplemental_application/SupplementalApplicationPage',
  ({ id } = {}) => {
    const MockApplicationDetailsPage = ({ applicationId }) => (
      <div>
        MockApplicationDetailsPage <h1>{applicationId}</h1>
      </div>
    )
    return {
      __esModule: true,
      default: ({ applicationId }) => {
        return <MockApplicationDetailsPage applicationId={applicationId} />
      }
    }
  }
)

jest.mock('../../../app/javascript/components/lease_ups/LeaseUpListingsPage', () => {
  const MockListingsPageComponent = () => <div>MockListingsPageComponent</div>
  return {
    __esModule: true,
    default: () => {
      return <MockListingsPageComponent />
    }
  }
})

jest.mock('../../../app/javascript/components/lease_ups/LeaseUpApplicationsPage', () => {
  const MockApplicationsPageComponent = () => <div>MockApplicationsPageComponent</div>
  return {
    __esModule: true,
    default: () => {
      return <MockApplicationsPageComponent />
    }
  }
})

jest.mock('../../../app/javascript/components/applications/ApplicationPage', () => {
  const MockShortFormComponent = (isLeaseUp) => (
    <div>
      MockShortFormComponent <h1>{isLeaseUp ? 'true' : 'false'}</h1>
    </div>
  )
  return {
    __esModule: true,
    default: ({ isLeaseUp }) => {
      return <MockShortFormComponent isLeaseUp={isLeaseUp} />
    }
  }
})

const MOCK_NAME_APP_DETAILS = 'MockApplicationDetailsPage'
const MOCK_NAME_LISTINGS = 'MockListingsPageComponent'
const MOCK_NAME_SHORT_FORM = 'MockShortFormComponent'
const MOCK_NAME_APPLICATIONS = 'MockApplicationsPageComponent'

const getScreen = (url) => {
  return render(
    <Router initialEntries={[url]}>
      <LeaseUpRoutes />
    </Router>
  )
}
let consoleSpy
describe('LeaseUpRoutes', () => {
  beforeEach(() => {
    // When an incorrect URL is passed in, the console.warn is called
    // We want to ensure that the console.warn is called and then
    // suppress the output so the test output is clean
    consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  describe('routes for flagged application pages', () => {
    test('should not render any page (redirect to rails routing) with type=pending', () => {
      getScreen('/applications/flagged?type=pending')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Matched leaf route at location "/applications/flagged?type=pending" does not have an element or Component.'
        )
      )
    })

    test('should not render any page (redirect to rails routing) with type=duplicate', () => {
      getScreen('/applications/flagged?type=duplicate')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Matched leaf route at location "/applications/flagged?type=duplicate" does not have an element or Component.'
        )
      )
    })
  })

  describe('routes for application edit page', () => {
    test('should not render any page (redirect to rails routing)', () => {
      getScreen('/applications/applicationId/edit')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Matched leaf route at location "/applications/applicationId/edit" does not have an element or Component.'
        )
      )
    })
  })

  describe('applications for lease-up listing paths', () => {
    test('should render the applications page when the exact path is passed in', () => {
      getScreen('/lease-ups/listings/testListingId')
      expect(screen.getByText(MOCK_NAME_APPLICATIONS)).toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
    })

    test('should not render anything when additional path params are provided', () => {
      getScreen('/lease-ups/listings/testListingId/somethingElse')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
    })
  })

  describe('listings page paths', () => {
    test('should render the listings page when the exact path is passed in', () => {
      getScreen('/lease-ups/listings')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.getByText(MOCK_NAME_LISTINGS)).toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
    })
  })

  describe('non lease-up short form paths', () => {
    test('should render the short form page when the exact path is passed in', () => {
      getScreen('/applications/testApplicationId')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.getByText(MOCK_NAME_SHORT_FORM)).toBeInTheDocument()
    })

    test('should render the short form page with isLeaseUp=false', () => {
      getScreen('/applications/testApplicationId')
      // proxy to determine if isLeasUp is falsy
      expect(screen.queryByRole('heading', { name: 'false' })).not.toBeInTheDocument()
    })

    test('should not render anything when additional path params are provided', () => {
      getScreen('/applications/testApplicationId/somethingElse')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'No routes matched location "/applications/testApplicationId/somethingElse"'
        )
      )
    })
  })

  describe('lease-up short form paths', () => {
    test('should render the lease up snapshot page when the exact path is passed in', () => {
      getScreen('/lease-ups/applications/testApplicationId')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.getByText(MOCK_NAME_APP_DETAILS)).toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
    })

    test('should not render anything when additional path params are provided', () => {
      getScreen('/lease-ups/applications/testApplicationId/somethingElse')
      expect(screen.queryByText(MOCK_NAME_APPLICATIONS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_LISTINGS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_APP_DETAILS)).not.toBeInTheDocument()
      expect(screen.queryByText(MOCK_NAME_SHORT_FORM)).not.toBeInTheDocument()
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'No routes matched location "/lease-ups/applications/testApplicationId/somethingElse"'
        )
      )
    })
  })
})
