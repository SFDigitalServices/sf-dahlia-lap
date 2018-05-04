import React from 'react'

import Dropdown from '../molecules/Dropdown'

class DropdownWrapper extends React.Component {

  state = { value: null }

  onChange = (value, label) => {
    this.setState({value: value})
  }

  render() {
    const items = [
      { value: 'value1', label:'label1' },
      { value: 'value2', label:'label2' }
    ]

    return (
      <div>
        <div>
          Value: {this.state.value}
          <Dropdown prompt="Select option" value={this.state.value} onChange={this.onChange} items={items} />
        </div>
        <div>
          Value: {this.state.value}
          <Dropdown prompt="Select option" multiple={true} value={this.state.value} onChange={this.onChange} items={items} />
        </div>
      </div>
    )
  }
}

export default DropdownWrapper
