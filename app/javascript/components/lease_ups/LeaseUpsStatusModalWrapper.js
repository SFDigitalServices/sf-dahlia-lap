import React from 'react'
import _ from 'lodash'

import Dropdown from '../molecules/Dropdown'
import FormModal from 'components/organisms/FormModal'
import { TextArea } from 'react-form'
import formUtils from '~/utils/formUtils'
import { LEASE_UP_STATUS_OPTIONS } from './data'

class LeaseUpsStatusModalWrapper extends React.Component {
  getStatusButtonStyle(status) {
    return status ? _.find(LEASE_UP_STATUS_OPTIONS, {value: status}).style : 'tertiary'
  }

  formValidator = (values) => {
    return {
      comment: !values.comment || values.comment.trim() === '' ? 'Please provide a comment.' : null,
    };
  };

  render() {
    return (
      <FormModal
        header="Update Status"
        primary="update"
        secondary="cancel"
        isOpen={this.props.isOpen}
        handleClose={this.props.closeHandler}
        onSubmit={this.props.submitHandler}
        onSecondaryClick={this.props.closeHandler}
        type="status"
        validateError={this.formValidator}>
          {formApi => (
            <div className={'form-group ' + (formUtils.submitErrors(formApi).comment ? 'error' : '')}>
              <h2 className="form-label">Status/Comment</h2>
              <Dropdown
                items={LEASE_UP_STATUS_OPTIONS}
                value={this.props.status}
                prompt="Status"
                onChange={this.props.changeHandler}
                buttonClasses={[this.getStatusButtonStyle(this.props.status), 'margin-bottom--half', 'expand', 'small']} />
              {!this.props.status && <small className="error">Please provide a status.</small>}
              <label className='sr-only' htmlFor="status-comment" id="status-comment-label">Comment</label>
              <TextArea
                field="comment"
                name="comment"
                id="status-comment"
                cols="30"
                rows="10"
                placeholder="Add a comment"
                aria-describedby="status-comment-label"
                className={formUtils.submitErrors(formApi).comment ? 'error' : ''} />
              {formUtils.submitErrors(formApi).comment && <small className="error">{formApi.errors.comment}</small>}
            </div>
          )}
      </FormModal>
    )
  }
}

export default LeaseUpsStatusModalWrapper
