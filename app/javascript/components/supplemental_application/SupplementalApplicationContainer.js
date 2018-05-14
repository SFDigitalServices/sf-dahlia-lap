import React from 'react'

const SupplementalApplicationContainer = ({}) => {
  // style="display: none;"
  return (
    <React.Fragment>
      <div class="app-inner inset-wide padding-bottom-none margin-top">
        <h2 class="sr-only">Status Update</h2>
        <div class="status-update expand-wide is-processing">
          <h3 class="status-update_title">Update Status</h3>
          <div class="status-update_action">
            <button class="button dropdown-button has-icon--right text-align-left small is-processing" href="#" aria-expanded="false">
              <span class="ui-icon ui-small" aria-hidden="true">
                <svg>
                  <use xlinkHref="#i-arrow-down"></use>
                </svg>
              </span>
              Processing
            </button>
          </div>
          <div class="status-update_message">
            <div class="status-update_comment">
              <p class="status-update_note">Some comment</p>
              <span class="status-update_date">03/12/18 </span>
            </div>
            <div class="status-update_footer">
              <button class="button tiny tertiary" type="button" data-event="">Add a comment</button>      <a href="#" class="t-small right">See Status History</a>
            </div>
          </div>
        </div>
      </div>

      <div class="app-inner header-wide">
        <h2 class="app-card_h2">Current Contact Information</h2>
      </div>
    </React.Fragment>
  )
}

export default SupplementalApplicationContainer
