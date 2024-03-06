import React, { useState } from 'react'

import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

const GoogleAnalyticsTracker = ({ mockWindow = null }) => {
  const location = useLocation()
  const [lastPath, setLastPath] = useState(null)

  const ga = !mockWindow ? window.ga : mockWindow.ga

  React.useEffect(() => {
    const newPath = location.pathname + location.search
    const isFirstRender = lastPath === null
    const isNewPage = lastPath !== newPath
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
  }, [location, ga, lastPath])

  return null
}

GoogleAnalyticsTracker.propTypes = {
  mockWindow: PropTypes.object // just for testing
}

export default GoogleAnalyticsTracker
