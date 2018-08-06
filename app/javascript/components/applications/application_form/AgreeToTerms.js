import React from 'react'
import { Checkbox } from 'react-form'

const AgreeToTerms = () => (
    <div className="checkbox-group" role="group">
      <div className="form-item" >
        <div className="checkbox">
          <Checkbox field="agreeToTerms" id="agreeToTerms" name="agreeToTerms" />
          <label htmlFor="agreeToTerms">Signature on Terms of Agreement</label>
        </div>
      </div>
    </div>
)

export default AgreeToTerms
