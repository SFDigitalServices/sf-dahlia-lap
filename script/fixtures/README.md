# Local fixture mode

A throwaway harness for doing UI work without a Salesforce connection. When
`SF_FIXTURES` is set in development, a Rack middleware answers every
`/api/v1` GET from a static JSON file under `tmp/fixtures/` and never
constructs a `Force::*` service, so no Salesforce credentials are needed and
nothing can be written back to Salesforce.

## Running

```sh
SF_FIXTURES=1 bin/rails server
# in another shell, as usual:
bin/shakapacker-dev-server --hot
```

Fixture mode also signs in a fake development-only user, because the normal
login goes through Salesforce OAuth and can't complete locally.

Then open, e.g. <http://localhost:3000/listings/a0W7y00000HayVJEAZ/lottery-results>.

## Capturing fixtures

1. Log in to <https://partner.housing.sfgov.org> and open the DevTools console.
2. Paste the contents of `script/fixtures/capture-console.js`.
3. Run `captureFixtures('a0W7y00000HayVJEAZ')`. It re-issues the page's GETs,
   redacts them in the browser, prints the list of dropped key paths, and
   downloads `lap-fixtures-<listingId>.json`.
4. `bin/unpack-fixtures ~/Downloads/lap-fixtures-a0W7y00000HayVJEAZ.json`

`tmp/` is gitignored, so fixtures stay local by default. Keep it that way
unless the data has been reviewed — see "Redaction" below.

If a screen needs an endpoint that isn't captured yet, load the page in
fixture mode and read the log: every miss prints the exact filename it wanted.

```
[FixtureProxy] MISS /api/v1/lottery-results?listing_id=a0W... ->
  expected tmp/fixtures/lottery-results__listing_id=a0W....json
```

Add that path to the relevant entry in `SCREENS` in the console script and
re-capture.

## Redaction

The console script redacts before the data ever reaches disk:

- **allowlist mode** (used for `/lottery-results`): only explicitly listed keys
  survive. What's kept is lottery numbers and ranks, preference type/order,
  and income-ish aggregate fields — no names, emails, phones, addresses, or
  dates of birth. Dropped key paths are printed after each run.
- **scrub mode** (used for the listing payload): keys matching a PII name
  pattern are dropped, minus a small exception list for things the UI renders
  (listing name, building name).
- a final pass rewrites any surviving string that looks like an email, phone
  number, or SSN.

`bin/unpack-fixtures` re-runs an independent PII scan and refuses to write if
it finds anything, so an edited or stale bundle can't silently land
unredacted data in the working tree.

The allowlist is deliberately conservative and may drop a field the page turns
out to need. If the local page misbehaves, check the dropped-keys output, add
the (non-identifying) key to `PREFERENCE_ALLOW`, and re-capture.

## Why not a HAR file?

A HAR records request headers verbatim, which means session cookies and auth
tokens end up in the file, and it captures responses unredacted by
construction. The bundle format above is redacted at capture time and contains
only response bodies.

## Scope

Deliberately minimal — this is a test harness, not a Salesforce emulator.

- Only `/api/v1` GETs are served from fixtures. Non-GETs return `{}` so
  optimistic UI flows can advance; nothing is persisted.
- Screens whose controllers query Salesforce inline during page render
  (`applications#index`, `applications#edit`) are **not** covered. The
  lottery results, lease-up, and supplemental screens are, because those
  controllers only mount React and all their data arrives over `/api/v1`.
- Fixtures are static. Anything that depends on a mutation round-tripping
  through Salesforce won't reflect the change after a reload.
