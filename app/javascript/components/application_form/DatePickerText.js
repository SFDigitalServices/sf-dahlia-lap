import React from 'react'
import { FormField } from 'react-form'
import DatePicker from 'react-datepicker'
import moment from 'moment'

// Define your custom input
// Note, the ...rest is important because it allows you to pass any
// additional fields to the internal <input>.
class DatePickerTextWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dateValue: moment(this.props.prefilledDate)
    }
  }

  render() {

    const {
      fieldApi,
      onInput,
      ...rest
    } = this.props;

    const {
      setValue,
      // getValue,
      // getError,
      // getWarning,
      // getSuccess,
      // setTouched,
    } = fieldApi;

    // const error = getError();
    // const warning = getWarning();
    // const success = getSuccess();

    return (
      <div>
        <DatePicker
          required={this.props.required}
          selected={this.state.dateValue}
          onChange={( date ) => {
            this.setState({ dateValue: date })
            setValue(moment(date).format(this.props.dateFormat))
          }}
          {...rest}
        />
      </div>
    );
  }
}

// Use the form field and your custom input together to create your very own input!
export default FormField(DatePickerTextWrapper)
