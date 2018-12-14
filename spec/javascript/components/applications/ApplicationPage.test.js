import React from 'react'
import { clone } from 'lodash'
import renderer from 'react-test-renderer'
import ApplicationPage from 'components/applications/ApplicationPage'
import sharedHooks from '../../support/sharedHooks'
import domainApplication from '../../fixtures/domain_application'

describe('ApplicationPage for app without flagged apps', () => {
  describe('should render', () => {
    sharedHooks.useFakeTimers()
    test('successfully without flagged apps table', () => {
      const fileBaseUrl = 'http:/www.someurl.com'
      const wrapper = renderer.create(
        <ApplicationPage
          application={domainApplication}
          file_base_url={fileBaseUrl} />
      )

      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    test('successfully with flagged apps table', () => {
      const applicationWithFlagged = clone(domainApplication)
      applicationWithFlagged.flagged_applications = [{
        'flagged_record':
          {
            'id': 'a0r0P00002X4r08QAB',
            'rule_name': 'Name + DOB',
            'total_number_of_pending_review': 51
          }
      }]

      expect(applicationWithFlagged.flagged_applications).toHaveLength(1)
      expect(applicationWithFlagged.flagged_applications[0].flagged_record).toBeTruthy()

      const fileBaseUrl = 'http:/www.someurl.com'
      const wrapper = renderer.create(
        <ApplicationPage
          application={applicationWithFlagged}
          file_base_url={fileBaseUrl} />
      )
      expect(wrapper.toJSON()).toMatchSnapshot()
    })
  })
})
