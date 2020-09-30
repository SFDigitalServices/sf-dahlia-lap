import React from 'react'
import { act } from 'react-dom/test-utils'
import ApplicationPage from 'components/applications/ApplicationPage'
import application from '../../fixtures/application'
import saleApplication from '../../fixtures/sale_application'
import { mount } from 'enzyme'
import ApplicationDetails from '~/components/applications/application_details/ApplicationDetails'

import Loading from '~/components/molecules/Loading'

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

const getWrapper = async (applicationId, waitForLoadingFinish = false) => {
  let wrapper

  // have to wrap in await act so that all useEffectOnMount updates finish.
  await act(async () => {
    wrapper = mount(<ApplicationPage applicationId={applicationId} />)
  })

  if (waitForLoadingFinish) {
    await act(tick)
    wrapper.update()
  }

  return wrapper
}

describe('ApplicationPage', () => {
  describe('with regular application', () => {
    const appId = REGULAR_APP_ID
    describe('before application is loaded', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper(appId)
      })

      test('should be loading', () => {
        expect(wrapper.find(Loading).prop('isLoading')).toBeTruthy()
      })

      test('does not render ApplicationDetails', () => {
        expect(wrapper.find(ApplicationDetails)).toHaveLength(0)
      })
    })

    describe('After the application finishes loading', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper(appId, true)
      })

      test('should no longer be loading', () => {
        expect(wrapper.find(Loading).prop('isLoading')).toBeFalsy()
      })

      test('renders ApplicationDetails', () => {
        expect(wrapper.find(ApplicationDetails)).toHaveLength(1)
      })

      test('should match snapshot', () => {
        // TODO: Expand test coverage on this page to the point that we do not need this snapshot check.
        expect(wrapper).toMatchSnapshot()
      })
    })

    describe('with sale application', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper(SALE_APP_ID, true)
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
        wrapper = await getWrapper(NO_FLAGS_ID, true)
      })

      test('does not render flagged app content card', async () => {
        expect(wrapper.exists(flaggedAppCardSelector)).toEqual(false)
      })
    })

    describe('with flagged application', () => {
      let wrapper
      beforeEach(async () => {
        wrapper = await getWrapper(FLAGGED_APP_ID, true)
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
  })
})
