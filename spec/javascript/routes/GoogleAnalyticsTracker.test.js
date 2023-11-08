import React from 'react'

import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { MemoryRouter as Router, Route, Routes, Link } from 'react-router-dom'

import GoogleAnalyticsTracker from 'routes/GoogleAnalyticsTracker'

import { findWithText } from '../../../spec/javascript/testUtils/wrapperUtil'

const mockWindow = {
  ga: jest.fn()
}

const getWrapper = () =>
  mount(
    <Router initialEntries={['/initial']}>
      <Routes>
        <Route exact path='/initial'>
          <Link to={'/other'}>Go to second page</Link>
        </Route>
        <Route exact path='/other'>
          <p>Other route</p>
          <Link to={'/other2'}>Go to third page</Link>
        </Route>
        <Route exact path='/other2'>
          <p>Other route 2</p>
          <Link to={'/initial'}>Go to first page</Link>
        </Route>
      </Routes>
      <GoogleAnalyticsTracker mockWindow={mockWindow} />
    </Router>
  )

describe('GoogleAnalyticsTracker', () => {
  const clickLink = async (wrapper, text) => {
    await act(async () => {
      findWithText(wrapper, Link, text).find('a').simulate('click', { button: 0 })
    })
    wrapper.update()
  }

  describe('on first load', () => {
    let wrapper
    beforeEach(() => {
      wrapper = getWrapper()
    })

    test('does not send request to google', async () => {
      expect(mockWindow.ga.mock.calls).toHaveLength(0)
    })

    describe('after navigating to a second page', () => {
      beforeEach(async () => {
        mockWindow.ga.mockReset()
        await clickLink(wrapper, 'Go to second page')
      })

      test('it logs the second pageview', () => {
        expect(mockWindow.ga.mock.calls).toEqual([
          ['set', 'page', '/other'],
          ['send', 'pageview']
        ])
      })

      describe('after navigating to a third page', () => {
        beforeEach(async () => {
          mockWindow.ga.mockReset()
          await clickLink(wrapper, 'Go to third page')
        })

        test('it logs the /other2 pageview', () => {
          expect(mockWindow.ga.mock.calls).toEqual([
            ['set', 'page', '/other2'],
            ['send', 'pageview']
          ])
        })

        describe('after navigating back to the first page', () => {
          beforeEach(async () => {
            mockWindow.ga.mockReset()
            await clickLink(wrapper, 'Go to first page')
          })

          test('it logs the pageview for /initial', () => {
            expect(mockWindow.ga.mock.calls).toEqual([
              ['set', 'page', '/initial'],
              ['send', 'pageview']
            ])
          })
        })
      })
    })
  })
})
