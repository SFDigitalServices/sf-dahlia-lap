import React from 'react'
import ReactDOM  from 'react-dom'
import DropdownMenu from '../molecules/DropdownMenu'
import DropdownMenuMultiSelect from '../molecules/DropdownMenuMultiSelect'
import _ from 'lodash'

const computeTopWith = (buttonRef) => {
  // Hardcoded for now.
  // Not spending time yet on getting the right top based on button
  return 50
}

const computeLeftWith = (ref) => {
  return 0
}

class Dropdown extends React.Component {

  constructor(props) {
    super(props)
    this.state = { expanded: false, style: { top: 0, left: 0 } }
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.onEscapeHandler);
    this.setState({
      style: {
        top: computeTopWith(this.buttonRef),
        left: computeLeftWith(this.buttonRef)
       }
    })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.onEscapeHandler);
  }

  toggleExpand = (e) => {
    this.setState((prevState) => ({ expanded: !prevState.expanded }))
    e.stopPropagation() // We need this so we do no call collpase function
  }

  componentClickHandler = (e) => {
    // We want to hide only when we click in the component but outisde the menu
    if (this.wrapperRef == e.target)
      this.setState({expanded: false })
  }

  onChangeHandler = (value, label) => {
    if (!this.props.multiple)
      this.setState({expanded: false})
    if (!this.props.multiple)
      this.buttonRef.focus()
    this.props.onChange && this.props.onChange(value, label)
  }

  menu() {
    const { prompt, size , items, value, multiple } = this.props
    if (this.state.expanded) {
      if (multiple) {
        return (
          <DropdownMenuMultiSelect
            style={this.state.style}
            onChange={this.onChangeHandler}
            values={value}
            items={items}/>
        )
      } else {
        return (
          <DropdownMenu
            style={this.state.style}
            onChange={this.onChangeHandler}
            value={value}
            items={items}/>
        )
      }
    }
  }

 handleClickOutside(event) {
   if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
     this.setState({expanded: false})
   }
 }

 onEscapeHandler = (event) => {
   if (event.keyCode === 27)
    this.setState({expanded: false})
 }

 render() {
   const { prompt, size = 'small', items, value, buttonClasses = []} = this.props
   const selectedItem = _.find(items, { value: value })
   // console.log(selectedItem, 'selectedItem')

   return (
    <div className="dropdown" onClick={this.componentClickHandler} ref={(node) => this.wrapperRef = node } style={{ position: 'absolute' }}>
      <button
        aria-expanded={this.state.expanded ? 'true' : 'false' }
        onClick={this.toggleExpand} ref={(node) => this.buttonRef = node }
        className={`button dropdown-button has-icon--right text-align-left ${buttonClasses.join(' ')}`}>
          <span className="ui-icon ui-small">
            <svg>
              <use xlinkHref="#i-arrow-down"></use>
            </svg>
          </span>
          {selectedItem ? selectedItem.label : prompt}
      </button>
      <div aria-hidden={this.state.expanded ? 'false' : 'true'} role='menu'>
        {this.menu()}
      </div>
    </div>
    )
  }
}

export default Dropdown
