import React from 'react'
import DropdownMenu from '../molecules/dropdownMenu'

/*
TODO
1. Change Dropdown label, based on selected
2. Callback from the outside world
3. Wrapper for pattern library
*/
class Dropdown extends React.Component {

  state = { expanded: false }

  toggleExpand = () => {
    this.setState((prevState) => ({ expanded: !prevState.expanded }))
  }

  onChange = (key, value) => {
    this.setState({expanded: false})
  }

  render() {
    const { text, size } = this.props
    const style = {}
    const items = [
      { value: 'key1', label:'value1' },
      { value: 'key2', label:'value2' }
    ]

    const value='key1'

    return (
      <div class="dropdown">
        <button onClick={this.toggleExpand} className={`${size} button dropdown-button has-icon--right text-align-left`}>
          <span className="ui-icon ui-small">
            <svg>
              <use xlinkHref="#i-arrow-down"></use>
            </svg>
          </span>
          {text}
        </button>
        { this.state.expanded &&
          <DropdownMenu
            style={style}
            onChange={this.onChange}
            value={value}
            items={items}/>
        }
      </div>
    )
  }
}

export default Dropdown
