import React from 'react'
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';

import Dropdown from '../molecules/Dropdown'
import SimpleModal from 'components/organisms/SimpleModal'
import { LEASE_UP_STATUS_OPTIONS } from './data'

class LeaseUpsStatusModalWrapper extends React.Component {
  render() {
    return (
      <SimpleModal
        header='Update Status'
        primary='update'
        secondary='cancel'
        isOpen={this.props.isOpen}
        handleClose={this.props.handleClose}
        onPrimaryClick={() => {}}
        onSecondaryClick={() => {}}
        type='status'>
{/*        <Dropdown
          items={LEASE_UP_STATUS_OPTIONS}
          value={value}
          prompt="Status"
          onChange={onChange}
          buttonClasses={['tertiary', 'no-margin', 'tiny']} />
*/}

        <div className="form-group">
         <label>Comment Required</label>
         <textarea name="textarea-id" id="textarea-id" cols="30" rows="10" placeholder="Type here" aria-describedby="described-id"></textarea>
        </div>
      </SimpleModal>
    )
  }
}

export default LeaseUpsStatusModalWrapper
