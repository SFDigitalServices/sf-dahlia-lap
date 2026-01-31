# Cypress Test Reliability Improvements

## Problem
The `SupplementalApplicationPage/status_update.e2e.js` and `LeaseUpApplicationsPage/status_update.e2e.js` tests were failing intermittently on CircleCI due to race conditions and timing issues.

## Root Causes Identified

1. **Late Intercept Setup**: POST intercepts were being set up AFTER the actions that trigger them, causing race conditions
2. **Missing Explicit Waits**: No waits for UI elements to be visible/ready before interaction
3. **No Modal State Verification**: Tests didn't wait for modals to fully open before interacting
4. **Insufficient Timeout Values**: Default timeouts were too short for CI environments
5. **Text Comparison Issues**: Text values weren't being trimmed, causing whitespace mismatches
6. **No Disabled State Checks**: Tests didn't verify buttons were enabled before clicking
7. **Hidden Checkbox Elements**: Checkboxes with `opacity: 0` failed visibility checks

## Changes Made

### 1. SupplementalApplicationPage Test

**Before:**
- Intercepts set up in `beforeEach` for GET requests only
- POST intercepts set up inline after actions
- No visibility checks before interactions
- No timeout specifications

**After:**
- All intercepts (GET and POST) set up in `beforeEach` before any navigation
- Explicit visibility checks with timeouts for all interactive elements
- Modal visibility verification before interaction
- Increased timeouts for CI environment (10-15 seconds)

### 2. LeaseUpApplicationsPage Test

**Before:**
- No waits between bulk status updates
- Checkboxes clicked without checking if they're ready
- No wait for UI to refresh after modal closes

**After:**
- Added explicit waits for modal to close (15s timeout)
- Added 1s buffer after modal closes for UI to refresh
- Used `force: true` for checkbox clicks (they have `opacity: 0`)
- Changed visibility checks to existence checks for hidden checkboxes
- Added disabled state checks before clicking

### 3. Custom Commands (`cypress/support/commands.js`)

#### `testStatusModalUpdate` Command

**Improvements:**
- Added explicit modal visibility check with 10s timeout
- Added visibility checks for dropdown elements before clicking
- Added `.trim()` to text comparisons to handle whitespace
- Increased modal close timeout from default to 15s
- Added 500ms wait after modal closes for UI updates
- Added timeout specifications for all element queries
- Added `.clear()` before typing in comment field
- Added disabled state check for submit button

#### `fillOutAndSubmitStatusModal` Command

**Improvements:**
- Added modal visibility check at start
- Added `.clear()` before typing in comment field
- Added visibility and disabled state checks for submit button
- Added timeout specifications

#### `selectSubstatusIfRequired` Command

**Improvements:**
- Added explicit visibility checks with 5s timeouts
- Added timeout specifications for all element queries
- Ensured dropdown menu is visible before selecting

#### `selectStatusDropdownValue` Command

**Improvements:**
- Added visibility and disabled state checks
- Added timeout specifications (10s for dropdown, 5s for menu items)

## Key Patterns for Reliable Cypress Tests

1. **Set up all intercepts early**: Define all intercepts in `beforeEach` before navigation
2. **Always check visibility**: Use `should('be.visible')` before interacting with elements (unless intentionally hidden)
3. **Handle hidden elements**: Use `force: true` for elements with `opacity: 0` or other CSS hiding
4. **Specify timeouts**: Add explicit timeouts for CI environments (5-15s)
5. **Verify state**: Check that buttons are not disabled before clicking
6. **Wait for transitions**: Add small waits (500-1000ms) after animations/transitions
7. **Trim text**: Always `.trim()` text values before comparison
8. **Wait for modals**: Explicitly wait for modals to open/close completely
9. **Increase timeouts for API calls**: Use longer timeouts (15s) for network requests in CI
10. **Wait for UI updates**: After state changes, wait for the UI to refresh before assertions

## Testing Locally

**Note:** These E2E tests require Salesforce credentials to run. They will fail locally without proper environment variables set:
- `SALESFORCE_USERNAME`
- `SALESFORCE_PASSWORD`
- `COMMUNITY_LOGIN_URL`
- `LEASE_UP_LISTING_APPLICATION_ID`
- `LEASE_UP_LISTING_ID`
- `SECOND_ROW_LEASE_UP_APP_ID`
- `THIRD_ROW_LEASE_UP_APP_ID`

These are configured in CircleCI's environment variables for automated testing.

## Expected Outcome

These changes should significantly reduce test flakiness by:
- Eliminating race conditions with proper intercept setup
- Ensuring elements are ready before interaction
- Providing adequate time for UI updates in CI environments
- Handling text comparison edge cases
- Properly waiting for modal state transitions
- Handling hidden form elements correctly
- Waiting for UI to refresh after bulk operations
