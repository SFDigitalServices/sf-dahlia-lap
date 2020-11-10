import { shallow } from 'enzyme'
import { act } from 'react-dom/test-utils'

import ApplicationDetails from 'components/applications/application_details/ApplicationDetails'
import ApplicationPage from 'components/applications/ApplicationPage'
import CardLayout from 'components/layouts/CardLayout'
import Loading from 'components/molecules/Loading'

import application from '../../fixtures/application'
import saleApplication from '../../fixtures/sale_application'
import { mountAppWithUrl } from '../../testUtils/wrapperUtil'

const flaggedAppCardSelector = '#content-card-flagged_applications'

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

const getWrapper = async ({
  applicationId,
  withLeaseUpUrl = false,
  waitForLoadingFinish = false,
  queryParams = ''
}) => {
  const url = withLeaseUpUrl
    ? `/lease-ups/applications/${applicationId}${queryParams}`
    : `/applications/${applicationId}${queryParams}`

  let wrapper

  // have to wrap in await act so that all useEffectOnMount updates finish.
  await act(async () => {
    wrapper = mountAppWithUrl(url)
  })

  if (waitForLoadingFinish) {
    await act(tick)
    wrapper.update()
  }

  return wrapper.find(ApplicationPage)
}

describe('ApplicationPage', () => {
  describe('with regular application', () => {
    const appId = REGULAR_APP_ID
    describe('before application is loaded', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper({ applicationId: appId })
      })

      test('should be loading', () => {
        expect(wrapper.find(Loading).prop('isLoading')).toBeTruthy()
      })

      test('renders the correct header title and content', () => {
        expect(wrapper.find(CardLayout).props().pageHeader.title).toEqual('Application ')

        const headerContentWrapper = shallow(wrapper.find(CardLayout).props().pageHeader.content)
        expect(headerContentWrapper.text()).toEqual('Name of Listing: ')
      })

      test('does not render the tab section', () => {
        expect(wrapper.find(CardLayout).props().tabSection).toBeUndefined()
      })

      test('does not render ApplicationDetails', () => {
        expect(wrapper.find(ApplicationDetails)).toHaveLength(0)
      })

      test('called getShortFormApplication', () => {
        expect(mockGetShortFormApplication.mock.calls).toHaveLength(1)
        expect(mockGetShortFormApplication.mock.calls[0][0]).toEqual(REGULAR_APP_ID)
      })
    })

    describe('After the application finishes loading', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper({ applicationId: appId, waitForLoadingFinish: true })
      })

      test('should no longer be loading', () => {
        expect(wrapper.find(Loading).prop('isLoading')).toBeFalsy()
      })

      test('renders ApplicationDetails', () => {
        expect(wrapper.find(ApplicationDetails)).toHaveLength(1)
      })

      test('populates the header title and content with application details', () => {
        expect(wrapper.find(CardLayout).props().pageHeader.title).toEqual(
          'Application APP-00191270'
        )

        const headerContentWrapper = shallow(wrapper.find(CardLayout).props().pageHeader.content)
        expect(headerContentWrapper.text()).toEqual('Name of Listing: Test 5/30')
      })

      test('does not render the tab section', () => {
        expect(wrapper.find(CardLayout).props().tabSection).toBeUndefined()
      })

      test('should match snapshot', () => {
        // TODO: Expand test coverage on this page to the point that we do not need this snapshot check.
        expect(wrapper).toMatchSnapshot()
      })
    })
  })

  describe('with sale application', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({ applicationId: SALE_APP_ID, waitForLoadingFinish: true })
    })

    test('renders Eligibility section', async () => {
      expect(wrapper.find('.content-card_title').at(2).text()).toEqual('Eligibility')
    })

    test('renders name of lender', async () => {
      expect(wrapper.find('.application-details').childAt(2).text()).toContain('Jason Lockhart')
    })
  })

  describe('with application that has no flags', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({ applicationId: NO_FLAGS_ID, waitForLoadingFinish: true })
    })

    test('does not render flagged app content card', async () => {
      expect(wrapper.exists(flaggedAppCardSelector)).toEqual(false)
    })
  })

  describe('with flagged application', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({ applicationId: FLAGGED_APP_ID, waitForLoadingFinish: true })
    })

    test('renders flagged app content card', async () => {
      expect(wrapper.exists(flaggedAppCardSelector)).toEqual(true)
    })

    test('renders the correct rule name', () => {
      expect(wrapper.find(`${flaggedAppCardSelector} > table > tbody > tr`)).toHaveLength(1)
      expect(
        wrapper.find(`${flaggedAppCardSelector} > table > tbody > tr > td`).first().text()
      ).toEqual('Name + DOB')
    })
  })

  describe('with all query params = null', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true,
        queryParams: ''
      })
    })

    test('does not render the tab headers', async () => {
      expect(wrapper.text()).not.toContain('Supplemental Information')
      expect(wrapper.text()).not.toContain('Short Form Application')
    })

    test('does not render add button link', async () => {
      expect(wrapper.text()).not.toContain('Add new application')
    })
  })

  describe('without lease-up URL', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true
      })
    })

    test('does not render the tab headers', async () => {
      expect(wrapper.text()).not.toContain('Supplemental Information')
      expect(wrapper.text()).not.toContain('Short Form Application')
    })
  })

  describe('with leaseUp url', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({
        applicationId: REGULAR_APP_ID,
        withLeaseUpUrl: true,
        waitForLoadingFinish: true
      })
    })

    test('renders the tab headers', async () => {
      expect(wrapper.text()).toContain('Supplemental Information')
      expect(wrapper.text()).toContain('Short Form Application')
    })
  })

  describe('with showAppBtn query param = false', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true,
        queryParams: '?showAddBtn=false'
      })
    })

    test('does not render add button link', async () => {
      expect(wrapper.text()).not.toContain('Add new application')
    })
  })

  describe('with showAppBtn query param = true', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = await getWrapper({
        applicationId: REGULAR_APP_ID,
        waitForLoadingFinish: true,
        queryParams: '?showAddBtn=true'
      })
    })

    test('renders add button link', async () => {
      expect(wrapper.text()).toContain('Add new application')
    })
  })

  describe('with leaseup url and showAppBtn', () => {
    describe('before app is loaded', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper({
          applicationId: REGULAR_APP_ID,
          withLeaseUpUrl: true,
          waitForLoadingFinish: false,
          queryParams: '?showAddBtn=true'
        })
      })

      test('renders the correct header title and content', () => {
        const titleText = shallow(wrapper.find(CardLayout).props().pageHeader.title)
        const nbspUnicode = '\u00a0'
        expect(titleText.text()).toEqual(nbspUnicode)

        expect(
          wrapper
            .find(CardLayout)
            .props()
            .pageHeader.breadcrumbs.map((crumb) => crumb.title)
        ).toEqual(['Lease Ups', '', ''])
      })

      test('renders the tab section', () => {
        expect(
          wrapper
            .find(CardLayout)
            .props()
            .tabSection.items.map((i) => i.title)
        ).toEqual(['Short Form Application', 'Supplemental Information'])
      })

      test('does not render add button link', async () => {
        // add button link behavior isn't possible with lease up view
        expect(wrapper.text()).not.toContain('Add new application')
      })

      test('renders the tab headers', async () => {
        expect(wrapper.text()).toContain('Supplemental Information')
        expect(wrapper.text()).toContain('Short Form Application')
      })
    })

    describe('after loading finish', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper({
          applicationId: REGULAR_APP_ID,
          withLeaseUpUrl: true,
          waitForLoadingFinish: true,
          queryParams: '?showAddBtn=true'
        })
      })

      test('renders the correct header title and content', () => {
        expect(wrapper.find(CardLayout).props().pageHeader.title).toEqual(
          'APP-00191270: karen elizabeth jones'
        )

        expect(
          wrapper
            .find(CardLayout)
            .props()
            .pageHeader.breadcrumbs.map((crumb) => crumb.title)
        ).toEqual(['Lease Ups', 'Test 5/30', 'APP-00191270'])
      })

      test('renders the tab section', () => {
        expect(
          wrapper
            .find(CardLayout)
            .props()
            .tabSection.items.map((i) => i.title)
        ).toEqual(['Short Form Application', 'Supplemental Information'])
      })

      test('does not render add button link', async () => {
        // add button link behavior isn't possible with lease up view
        expect(wrapper.text()).not.toContain('Add new application')
      })

      test('renders the tab headers', async () => {
        expect(wrapper.text()).toContain('Supplemental Information')
        expect(wrapper.text()).toContain('Short Form Application')
      })
    })
  })
})
