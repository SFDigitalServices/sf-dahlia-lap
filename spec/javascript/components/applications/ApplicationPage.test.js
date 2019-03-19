import React from 'react'
import { clone } from 'lodash'
import ApplicationPage from 'components/applications/ApplicationPage'
import domainApplication from '../../fixtures/domain_application'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

describe('ApplicationPage', () => {
  describe('should render', () => {
    const flaggedAppCardSelector = '#content-card-flagged_applications'

    test('without error and as expected', () => {
      const fileBaseUrl = 'http://www.someurl.com'

      const wrapper = renderer.create(
        <ApplicationPage
          application={domainApplication}
          file_base_url={fileBaseUrl} />
      )
      // TODO: Expand test coverage on this page to the point that we do not need this snapshot check.
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    test('application without flagged applications', () => {
      const fileBaseUrl = 'http://www.someurl.com'
      expect(domainApplication.flagged_applications).toHaveLength(0)

      const wrapper = mount(
        <ApplicationPage
          application={domainApplication}
          file_base_url={fileBaseUrl} />
      )
      // Flagged application content card should not render
      expect(wrapper.exists(flaggedAppCardSelector)).toEqual(false)
    })

    test('application with flagged applications', () => {
      const applicationWithFlagged = clone(domainApplication)
      applicationWithFlagged.flagged_applications = [{
        'flagged_record':
          {
            'id': 'a0r0P00002X4r08QAB',
            'rule_name': 'Name + DOB',
            'total_number_of_pending_review': 51
          }
      }]

      const fileBaseUrl = 'http://www.someurl.com'
      const wrapper = mount(
        <ApplicationPage
          application={applicationWithFlagged}
          file_base_url={fileBaseUrl} />
      )
      // Flagged application content card should render
      expect(wrapper.exists(flaggedAppCardSelector)).toEqual(true)
      // Check that the row is there and contains the right rule name.
      expect(wrapper.find(`${flaggedAppCardSelector} > table > tbody > tr`)).toHaveLength(1)
      expect(wrapper.find(`${flaggedAppCardSelector} > table > tbody > tr > td`).first().text()).toEqual('Name + DOB')
    })
  })
})
