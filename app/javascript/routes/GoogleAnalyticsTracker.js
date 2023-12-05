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
    if (typeof ga === 'function' && isNewPage && !isFirstRender) {
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
