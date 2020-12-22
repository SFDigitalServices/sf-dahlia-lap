import React from 'react'

import { mount } from 'enzyme'
import { MemoryRouter as Router } from 'react-router-dom'

import LeaseUpRoutes from 'routes/LeaseUpRoutes'

jest.mock(
  '../../../app/javascript/components/supplemental_application/ApplicationDetailsPage',
  ({ id } = {}) => {
    const MockApplicationDetailsPage = ({ applicationId }) => <div />
    return {
      __esModule: true,
      default: ({ applicationId }) => {
        return <MockApplicationDetailsPage applicationId={applicationId} />
      }
    }
  }
)

jest.mock('../../../app/javascript/components/lease_ups/LeaseUpListingsPage', () => {
  const MockListingsPageComponent = () => <div />
  return {
    __esModule: true,
    default: () => {
      return <MockListingsPageComponent />
    }
  }
})

jest.mock('../../../app/javascript/components/lease_ups/LeaseUpApplicationsPage', () => {
  const MockApplicationsPageComponent = () => <div />
  return {
    __esModule: true,
    default: () => {
      return <MockApplicationsPageComponent />
    }
  }
})

jest.mock('../../../app/javascript/components/applications/ApplicationPage', () => {
  const MockShortFormComponent = () => <div />
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

const getWrapper = (url) => {
  return mount(
    <Router initialEntries={[url]}>
      <LeaseUpRoutes />
    </Router>
  )
}

describe('LeaseUpRoutes', () => {
  describe('routes for flagged application pages', () => {
    test('should not render any page (redirect to rails routing) with type=pending', () => {
      const wrapper = getWrapper('/applications/flagged?type=pending')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })

    test('should not render any page (redirect to rails routing) with type=duplicate', () => {
      const wrapper = getWrapper('/applications/flagged?type=duplicate')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })
  })

  describe('routes for application edit page', () => {
    test('should not render any page (redirect to rails routing)', () => {
      const wrapper = getWrapper('/applications/applicationId/edit')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })
  })

  describe('applications for lease-up listing paths', () => {
    test('should render the applications page when the exact path is passed in', () => {
      const wrapper = getWrapper('/lease-ups/listings/testListingId')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(1)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })

    test('should not render anything when additional path params are provided', () => {
      const wrapper = getWrapper('/lease-ups/listings/testListingId/somethingElse')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })
  })

  describe('listings page paths', () => {
    test('should render the listings page when the exact path is passed in', () => {
      const wrapper = getWrapper('/lease-ups/listings')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(1)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })
  })

  describe('non lease-up short form paths', () => {
    test('should render the short form page when the exact path is passed in', () => {
      const wrapper = getWrapper('/applications/testApplicationId')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(1)
    })

    test('should render the short form page with isLeaseUp=false', () => {
      const wrapper = getWrapper('/applications/testApplicationId')
      expect(wrapper.find(MOCK_NAME_SHORT_FORM).props().isLeaseUp).toBeFalsy()
    })

    test('should not render anything when additional path params are provided', () => {
      const wrapper = getWrapper('/applications/testApplicationId/somethingElse')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })
  })

  describe('lease-up short form paths', () => {
    test('should render the lease up snapshot page when the exact path is passed in', () => {
      const wrapper = getWrapper('/lease-ups/applications/testApplicationId')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(1)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })

    test('should not render anything when additional path params are provided', () => {
      const wrapper = getWrapper('/lease-ups/applications/testApplicationId/somethingElse')
      expect(wrapper.find(MOCK_NAME_APPLICATIONS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_LISTINGS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_APP_DETAILS)).toHaveLength(0)
      expect(wrapper.find(MOCK_NAME_SHORT_FORM)).toHaveLength(0)
    })
  })
})
