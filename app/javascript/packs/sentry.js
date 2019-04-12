/* global SENTRY_PUBLIC_DSN */
import * as Sentry from '@sentry/browser'

Sentry.init({
  dsn: SENTRY_PUBLIC_DSN
})
