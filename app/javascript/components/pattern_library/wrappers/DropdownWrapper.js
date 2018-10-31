import React from 'react'

import Dropdown from '~/components/molecules/Dropdown'

class DropdownWrapper extends React.Component {
  state = { dropdown1Value: null, dropdown2Value: null }

  onChangeDropdown1 = (value, label) => {
    this.setState({dropdown1Value: value})
  }

  onChangeDropdown2 = (values) => {
    this.setState({ dropdown2Value: values })
  }

  render () {
    const { items } = this.props

    return (
      <div>
        <h3>Single select</h3>
        <div>
          Value: {this.state.dropdown1Value}
          <Dropdown prompt='Select option' value={this.state.dropdown1Value} onChange={this.onChangeDropdown1} items={items} />
        </div>
        <h3>Multiple select</h3>
        <div>
          Values: {this.state.dropdown2Value}
          <Dropdown prompt='Select option' multiple value={this.state.dropdown2Value} onChange={this.onChangeDropdown2} items={items} />
        </div>
      </div>
    )
  }
}

export default DropdownWrapper
