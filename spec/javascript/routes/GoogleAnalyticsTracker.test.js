import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter as Router, Route, Routes, Link } from 'react-router-dom'

import GoogleAnalyticsTracker from 'routes/GoogleAnalyticsTracker'

const mockWindow = {
  ga: jest.fn()
}

const getWrapper = () =>
  render(
    <Router initialEntries={['/initial']}>
      <Routes>
        <Route exact path='/initial' element={<Link to={'/other'}>Go to second page</Link>} />
        <Route
          exact
          path='/other'
          element={
            <>
              <p>Other route</p>
              <Link to={'/other2'}>Go to third page</Link>
            </>
          }
        />
        <Route
          exact
          path='/other2'
          element={
            <>
              <p>Other route 2</p>
              <Link to={'/initial'}>Go to first page</Link>
            </>
          }
        />
      </Routes>
      <GoogleAnalyticsTracker mockWindow={mockWindow} />
    </Router>
  )

describe('GoogleAnalyticsTracker', () => {
  const clickLink = async (text) => {
    await act(async () => {
      fireEvent.click(screen.getByRole('link', text))
    })
  }

  describe('on first load', () => {
    beforeEach(() => {
      getWrapper()
    })

    test('does not send request to google', async () => {
      expect(mockWindow.ga.mock.calls).toHaveLength(0)
    })

    describe('after navigating to a second page', () => {
      beforeEach(async () => {
        mockWindow.ga.mockReset()
        await clickLink('Go to second page')
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
          await clickLink('Go to third page')
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
            await clickLink('Go to first page')
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
