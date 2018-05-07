import React from 'react'
import DropdownMenu from '../molecules/DropdownMenu'

// const Dropdown = ({ text, size, children }) => {
class Dropdown extends React.Component {
  state = { expanded: false }

  dropdownMenu() {
    return (
      <DropdownMenu>
        {this.props.children}
      </DropdownMenu>
    )
  }

  render() {
    const { text, size } = this.props
    const { expanded } = this.state


    let options = null;

    return (
      <div className="dropdown">
        <button className={`${size} button dropdown-button has-icon--right text-align-left`}>
          <span className="ui-icon ui-small">
            <svg>
              <use xlinkHref="#i-arrow-down"></use>
            </svg>
          </span>
          {text}
        </button>

        {options}
      </div>
    )
  }
}

export default Dropdown
