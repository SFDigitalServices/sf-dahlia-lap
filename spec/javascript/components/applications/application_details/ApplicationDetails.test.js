import React from 'react'

import { render } from '@testing-library/react'

import ApplicationDetails from 'components/applications/application_details/ApplicationDetails'

import application from '../../../fixtures/application'

describe('ApplicationDetails', () => {
  describe('should render', () => {
    test('without error and as expected', () => {
      const fileBaseUrl = 'http://www.someurl.com'

      const { asFragment } = render(
        <ApplicationDetails application={application} file_base_url={fileBaseUrl} />
      )
      expect(asFragment()).toMatchSnapshot()
    })

    test('file links with both url types', () => {
      const fileBaseUrl = 'http://www.someurl.com'

      const { getAllByRole } = render(
        <ApplicationDetails application={application} file_base_url={fileBaseUrl} />
      )

      const links = getAllByRole('link')

      expect(links[0].getAttribute('href')).toContain('servlet/servlet.FileDownload')

      const lastLink = links.pop()
      expect(lastLink.getAttribute('href')).toContain('sfc/servlet.shepherd/version/download')
    })
  })
})
