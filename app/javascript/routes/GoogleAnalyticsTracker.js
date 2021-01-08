import React, { useState } from 'react'

import PropTypes from 'prop-types'
import { Route } from 'react-router-dom'

/**
 * When the url changes, this will fire a Google Analytics pageview event.
 * Note that this component must be put inside a router but outside of any
 * routing switch components! That's because the path matches on everything,
 * so you don't want it to match and short-circuit the switch.
 */
const GoogleAnalyticsTracker = ({ mockWindow = null }) => {
  // this can't be inlined into the render function because of the useState hook.
  const LogNewPathsOnRender = ({ location }) => {
    const [lastPath, setLastPath] = useState(null)

    const newPath = location.pathname + location.search
    const isFirstRender = lastPath === null
    const isNewPage = lastPath !== newPath

    const ga = !mockWindow ? window.ga : mockWindow.ga

    if (
      typeof ga === 'function' &&
      isNewPage &&
      // we don't want to trigger analytics on first render, because we're already going that in application.html.slim.
      // routed analytics tracking should only be for navigation within routed apps.
      // TODO: when/if all of partners is migrated to single page app we can get rid of application.html.slim
      // tracking and do it all via routing.
      !isFirstRender
    ) {
      ga('set', 'page', newPath)
      ga('send', 'pageview')
    }

    if (lastPath !== newPath) {
      setLastPath(newPath)
    }

    return null
  }

  return <Route path='/' render={({ location }) => <LogNewPathsOnRender location={location} />} />
}

GoogleAnalyticsTracker.propTypes = {
  mockWindow: PropTypes.object // just for testing
}

export default GoogleAnalyticsTracker
