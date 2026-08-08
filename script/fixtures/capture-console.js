/*
 * Fixture capture script — paste into the DevTools console while logged in to
 * https://partner.housing.sfgov.org.
 *
 * It re-issues the same /api/v1 GETs the page makes, redacts PII out of the
 * responses IN THE BROWSER (before anything is written to disk), and downloads
 * a single JSON bundle. Unpack it into tmp/fixtures with:
 *
 *     bin/unpack-fixtures ~/Downloads/lap-fixtures-<listingId>.json
 *
 * Usage, from a console on any partners page:
 *
 *     captureFixtures('a0W7y00000HayVJEAZ')            // lottery results screen
 *     captureFixtures('a0W7y00000HayVJEAZ', { dryRun: true })  // inspect, don't download
 *
 * The lotteryResults screen captures both variants of the results endpoint, so
 * the local page works at /listings/<id>/lottery-results and at that URL with
 * ?withLotteryResultApi appended.
 *
 * Nothing here writes to Salesforce: only GETs are issued.
 */
;(() => {
  // Endpoints needed per screen. Paths are relative to /api/v1 and the keys
  // must match what FixtureProxy derives from the request (path + sorted
  // query), because that's the fixture filename.
  const SCREENS = {
    lotteryResults: (listingId) => [
      {
        path: `/lottery-results?listing_id=${listingId}`,
        redact: 'allow',
        allow: PREFERENCE_ALLOW
      },
      // the ?withLotteryResultApi variant of the page. the legacy SOQL query
      // above only returns applications that actually receive a preference, so
      // for most listings it is a tiny slice; the LotteryResult API returns
      // every bucket including the general lottery.
      {
        path: `/lottery-results?listing_id=${listingId}&use_lottery_result_api=true`,
        redact: 'allow',
        allow: BUCKET_ALLOW
      },
      { path: `/lease-ups/listings/${listingId}`, redact: 'scrub' }
    ]
  }

  // Allowlist for lottery/preference records: everything the lottery results
  // page reads, and nothing that identifies an applicant. Keys not listed here
  // are dropped and reported in the console summary — if the local page breaks
  // for want of a field, add it here (as long as it isn't identifying) and
  // re-capture.
  const PREFERENCE_ALLOW = new Set([
    // envelope
    'records',
    'total_size',
    'done',
    'listing_type',
    'pages',
    // preference record
    'id',
    'application',
    'application_id',
    'custom_preference_type',
    'preference_name',
    'preference_all_name',
    'preference_lottery_rank',
    'preference_all_lottery_rank',
    'preference_order',
    'receives_preference',
    'record_type_for_app_preferences',
    'recordtype_developername',
    'listing_preference_id',
    'post_lottery_validation',
    'opt_out',
    'total_household_rent',
    // nested application
    'lottery_number',
    'lottery_number_manual',
    'lottery_rank',
    'unsorted_lottery_rank',
    'general_lottery',
    'general_lottery_rank',
    'listing_id',
    'status',
    'sub_status',
    'application_submitted_date',
    'annual_income',
    'monthly_income',
    'household_size'
  ])

  // Allowlist for the LotteryResult API shape (see massageLotteryBuckets in
  // utils/processLotteryBuckets.js). Same rule as above: nothing identifying.
  const BUCKET_ALLOW = new Set([
    // envelope
    'lotteryBuckets',
    // bucket
    'preferenceName',
    'preferenceShortCode',
    'preferenceOrder',
    'preferenceResults',
    // result
    'lotteryNumber',
    'lotteryRank',
    'applicationId'
  ])

  // Key-name patterns that must never survive into a fixture, used by 'scrub'
  // mode (and as a second pass over allowlisted data, belt and braces).
  const DENY_KEY =
    /name|email|phone|address|street|city|zip|postal|dob|date_of_birth|birth|ssn|social|first|last|middle|contact|applicant|member|agent|alternate|guardian/i

  // Keys that match DENY_KEY but are listing metadata rather than personal
  // data, and that the UI actually renders.
  const DENY_EXCEPT = new Set([
    'name', // listing name — shown in the page header
    'building_name',
    'listing_type',
    'preference_name',
    'preference_all_name',
    'custom_preference_type',
    'developer',
    'preferenceName',
    'preferenceShortCode'
  ])

  // Last-resort sweep over surviving string values, in case something
  // identifying lives under an innocuous key name.
  const VALUE_PATTERNS = [
    [/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email redacted]'],
    [/(\+?\d[\d\s().-]{8,}\d)/g, '[phone redacted]'],
    [/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn redacted]']
  ]

  const dropped = new Set()

  const scrubValue = (value) =>
    typeof value === 'string'
      ? VALUE_PATTERNS.reduce(
          (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
          value
        )
      : value

  const redact = (node, { mode, allow, path = '' }) => {
    if (Array.isArray(node)) {
      return node.map((item) => redact(item, { mode, allow, path }))
    }
    if (node === null || typeof node !== 'object') {
      return scrubValue(node)
    }

    return Object.entries(node).reduce((acc, [key, value]) => {
      const keyPath = path ? `${path}.${key}` : key
      const denied = DENY_KEY.test(key) && !DENY_EXCEPT.has(key)
      const notAllowed = mode === 'allow' && !allow.has(key) && !DENY_EXCEPT.has(key)

      if (denied || notAllowed) {
        dropped.add(keyPath)
        return acc
      }

      acc[key] = redact(value, { mode, allow, path: keyPath })
      return acc
    }, {})
  }

  // Mirror of FixtureProxy.fixture_name in lib/fixture_proxy.rb.
  const fixtureName = (path) => {
    const [rawPath, rawQuery] = path.replace(/^\//, '').split('?')
    const params = [...new URLSearchParams(rawQuery || '').entries()]
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
    const name = params ? `${rawPath}__${params}` : rawPath
    return name.replace(/[^a-zA-Z0-9/=&_.,-]/g, '_')
  }

  const download = (filename, text) => {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
    const link = Object.assign(document.createElement('a'), { href: url, download: filename })
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  window.captureFixtures = async (
    listingId,
    { screen = 'lotteryResults', dryRun = false } = {}
  ) => {
    if (!listingId) throw new Error('captureFixtures(listingId) requires a listing id')

    const endpoints = SCREENS[screen](listingId)
    const bundle = {}
    dropped.clear()

    for (const endpoint of endpoints) {
      const url = `/api/v1${endpoint.path}`
      console.log(`[fixtures] GET ${url}`)
      const response = await fetch(url, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      })
      if (!response.ok) {
        console.error(`[fixtures] ${url} responded ${response.status}; skipping`)
        continue
      }
      const json = await response.json()
      bundle[fixtureName(endpoint.path)] = redact(json, {
        mode: endpoint.redact,
        allow: endpoint.allow || new Set()
      })
    }

    // report how many rows each payload actually carries, so a fixture that is
    // short because the API returned little is distinguishable from one that is
    // short because redaction ate it.
    for (const [name, payload] of Object.entries(bundle)) {
      const counts = []
      if (Array.isArray(payload.records)) {
        counts.push(`${payload.records.length} records (total_size ${payload.total_size})`)
      }
      if (Array.isArray(payload.lotteryBuckets)) {
        const rows = payload.lotteryBuckets.reduce(
          (sum, bucket) => sum + (bucket.preferenceResults || []).length,
          0
        )
        counts.push(`${payload.lotteryBuckets.length} buckets, ${rows} results`)
      }
      console.log(`[fixtures] ${name}: ${counts.join('; ') || 'object'}`)
    }

    console.log('[fixtures] captured:', Object.keys(bundle))
    console.log(
      `[fixtures] dropped ${dropped.size} key path(s) — review before trusting, and add any` +
        ' non-identifying key the local page needs to PREFERENCE_ALLOW:'
    )
    console.log([...dropped].sort().join('\n'))

    if (dryRun) {
      console.log('[fixtures] dryRun — not downloading. Inspect window.__lapFixtures')
      window.__lapFixtures = bundle
      return bundle
    }

    download(`lap-fixtures-${listingId}.json`, JSON.stringify(bundle, null, 2))
    console.log(
      '[fixtures] downloaded. Unpack with: bin/unpack-fixtures ~/Downloads/lap-fixtures-' +
        listingId +
        '.json'
    )
    return bundle
  }

  console.log("[fixtures] ready — run captureFixtures('<listingId>')")
})()
