import React from 'react'
import DropdownMenu from '../molecules/dropdownMenu'
import DropdownMenuMultiSelect from '../molecules/dropdownMenuMultiSelect'
import _ from 'lodash'

/*
TODO
1. Wrapper for pattern library
1. Position menu items
1. Include blank
*/
class Dropdown extends React.Component {

  constructor(props) {
    super(props)
    this.state = { expanded: false }
  }

  toggleExpand = () => {
    this.setState((prevState) => ({ expanded: !prevState.expanded }))
  }

  onChange = (value, label) => {
    this.setState({expanded: false})
    this.props.onChange && this.props.onChange(value, label)
  }

  menu() {
    const { prompt, size , items, value, multiple, style, onChange } = this.props

    if (this.state.expanded) {
      if (multiple) {
        return (
          <DropdownMenuMultiSelect
            style={style}
            onChange={this.onChange}
            value={value}
            items={items}/>
        )
      } else {
        return (
          <DropdownMenu
            style={style}
            onChange={this.onChange}
            value={value}
            items={items}/>
        )
      }
    }
  }

  render() {
    const { prompt, size , items, value} = this.props
    const style =  {}//{ left: '16px', top: '95px'}
    const selectedItem = _.find(items, { value: value })

    return (
      <div class="dropdown">
        <button onClick={this.toggleExpand} className={`${size} button dropdown-button has-icon--right text-align-left`}>
          <span className="ui-icon ui-small">
            <svg>
              <use xlinkHref="#i-arrow-down"></use>
            </svg>
          </span>
          {selectedItem ? selectedItem.label : prompt}
        </button>
        {this.menu()}
      </div>
    )
  }
}

export default Dropdown
