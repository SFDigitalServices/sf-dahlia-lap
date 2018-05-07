import React from 'react'

import Dropdown from '../molecules/Dropdown'

class DropdownWrapper extends React.Component {

  state = { dropdown1Value: null, dropdown2Value: null }

  onChangeDropdown1 = (value, label) => {
    this.setState({dropdown1Value: value})
  }

  onChangeDropdown2 = (values) => {
    this.setState({ dropdown2Value: values })
  }

  render() {
    const items = [
      { value: 'value1', label:'label1' },
      { value: 'value2', label:'label2' }
    ]

    return (
      <div>
        <div>
          Value: {this.state.dropdown1Value}
          <Dropdown prompt="Select option" value={this.state.dropdown1Value} onChange={this.onChangeDropdown1} items={items} />
        </div>
        <div>
          Values: {this.state.dropdown2Value}
          <Dropdown prompt="Select option" multiple={true} value={this.state.dropdown2Value} onChange={this.onChangeDropdown2} items={items} />
        </div>
      </div>
    )
  }
}

export default DropdownWrapper
