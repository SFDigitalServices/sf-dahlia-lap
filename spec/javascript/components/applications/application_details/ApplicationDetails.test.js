import React from 'react'
import ApplicationDetails from 'components/applications/application_details/ApplicationDetails'
import application from '../../../fixtures/application'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'

describe('ApplicationDetails', () => {
  describe('should render', () => {
    test('without error and as expected', () => {
      const fileBaseUrl = 'http://www.someurl.com'

      const wrapper = renderer.create(
        <ApplicationDetails application={application} file_base_url={fileBaseUrl} />
      )
      expect(wrapper.toJSON()).toMatchSnapshot()
    })

    test('file links with both url types', () => {
      const fileBaseUrl = 'http://www.someurl.com'

      const wrapper = mount(
        <ApplicationDetails application={application} file_base_url={fileBaseUrl} />
      )
      expect(wrapper.find('a').first().getDOMNode().getAttribute('href')).toContain(
        'servlet/servlet.FileDownload'
      )
      expect(wrapper.find('a').last().getDOMNode().getAttribute('href')).toContain(
        'sfc/servlet.shepherd/version/download'
      )
    })
  })
})
