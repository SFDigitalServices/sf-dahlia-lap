/* global SENTRY_DSN */
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: SENTRY_DSN
})
