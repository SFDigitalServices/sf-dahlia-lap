import React from 'react'
import { act } from 'react-dom/test-utils'
import ApplicationPage from 'components/applications/ApplicationPage'
import application from '../../fixtures/application'
import saleApplication from '../../fixtures/sale_application'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
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

const mockApplication = application
const mockSaleApplication = saleApplication

describe('ApplicationPage', () => {
  beforeAll(() => {})
  describe('before application is loaded', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = mount(
        <div>
          <ApplicationPage applicationId={REGULAR_APP_ID} />
        </div>
      )
    })

    test('should be loading', () => {
      expect(wrapper.find(Loading).prop('isLoading')).toBeTruthy()
    })

    test('does not render ApplicationDetails', () => {
      expect(wrapper.find(ApplicationDetails)).toHaveLength(0)
    })

    describe('After the application finishes loading', () => {
      beforeEach(async () => {
        await act(tick)
        wrapper.update()
      })

      test('should no longer be loading', () => {
        expect(wrapper.find(Loading).prop('isLoading')).toBeFalsy()
      })

      test('renders ApplicationDetails', () => {
        expect(wrapper.find(ApplicationDetails)).toHaveLength(1)
      })
    })
  })

  describe('should render', () => {
    test('without error and as expected', async () => {
      const wrapper = renderer.create(<ApplicationPage applicationId={REGULAR_APP_ID} />)
      await act(tick)
      wrapper.update()
      // TODO: Expand test coverage on this page to the point that we do not need this snapshot check.
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    test('application without flagged applications', async () => {
      const wrapper = mount(<ApplicationPage applicationId={NO_FLAGS_ID} />)
      await act(tick)
      wrapper.update()
      // Flagged application content card should not render
      expect(wrapper.exists(flaggedAppCardSelector)).toEqual(false)
    })

    test('application with flagged applications', async () => {
      const wrapper = mount(<ApplicationPage applicationId={FLAGGED_APP_ID} />)
      await act(tick)
      wrapper.update()
      // Flagged application content card should render
      expect(wrapper.exists(flaggedAppCardSelector)).toEqual(true)
      // Check that the row is there and contains the right rule name.
      expect(wrapper.find(`${flaggedAppCardSelector} > table > tbody > tr`)).toHaveLength(1)
      expect(
        wrapper.find(`${flaggedAppCardSelector} > table > tbody > tr > td`).first().text()
      ).toEqual('Name + DOB')
    })

    test('sale application', async () => {
      const wrapper = mount(<ApplicationPage applicationId={SALE_APP_ID} />)
      await act(tick)
      wrapper.update()
      // Should have Eligibility section
      expect(wrapper.find('.content-card_title').at(2).text()).toEqual('Eligibility')
      // Should fill in Name of Lender
      expect(wrapper.find('.application-details').childAt(2).text()).toContain('Jason Lockhart')
    })
  })
})
