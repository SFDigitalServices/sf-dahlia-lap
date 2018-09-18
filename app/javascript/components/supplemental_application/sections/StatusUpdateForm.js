import React from 'react'
import { Form, T } from 'react-form'

const StatusUpdateForm = (props) => {
  return (
    <Form>
      { formApi => (
        <React.Fragment>
          <h2 className='sr-only'>Status Update</h2>
          <div className='status-update expand-wide is-processing'>
            <h3 className='status-update_title'>Update Status</h3>
            <div className='status-update_action'>
              <button className='button dropdown-button has-icon--right text-align-left small is-processing' href='#' aria-expanded='false'>
                <span className='ui-icon ui-small' aria-hidden='true'>
                  <svg>
                    <use xlinkHref='#i-arrow-down' />
                  </svg>
                </span>
                Processing
              </button>
            </div>
            <div className='status-update_message'>
              <div className='status-update_comment'>
                <p className='status-update_note'>Some comment</p>
                <span className='status-update_date'>03/12/18 </span>
              </div>
              <div className='status-update_footer'>
                <button className='button tiny tertiary' type='button' data-event=''>Add a comment</button>
                <a href='/see_status_history' className='t-small right'>See Status History</a>
              </div>
            </div>
          </div>
        </React.Fragment>)
      }
    </Form>
  )
}

export default StatusUpdateForm

// <h2 className='sr-only'>Status Update</h2>
// <div className='status-update expand-wide is-processing'>
//   <h3 className='status-update_title'>Update Status</h3>
//   <div className='status-update_action'>
//     <button className='button dropdown-button has-icon--right text-align-left small is-processing' href='#' aria-expanded='false'>
//       <span className='ui-icon ui-small' aria-hidden='true'>
//         <svg>
//           <use xlinkHref='#i-arrow-down' />
//         </svg>
//       </span>
//       Processing
//     </button>
//   </div>
//   <div className='status-update_message'>
//     <div className='status-update_comment'>
//       <p className='status-update_note'>Some comment</p>
//       <span className='status-update_date'>03/12/18 </span>
//     </div>
//     <div className='status-update_footer'>
//       <button className='button tiny tertiary' type='button' data-event=''>Add a comment</button>
//       <a href='/see_status_history' className='t-small right'>See Status History</a>
//     </div>
//   </div>
// </div>
