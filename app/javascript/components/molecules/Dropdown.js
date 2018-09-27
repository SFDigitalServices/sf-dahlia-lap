import React from 'react'
import { find } from 'lodash'
import classNames from 'classnames'

import DropdownMenu from '../molecules/DropdownMenu'
import DropdownMenuMultiSelect from '../molecules/DropdownMenuMultiSelect'

class Dropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = { expanded: false, style: { top: 40, left: 0 } }
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
    document.addEventListener('keydown', this.onEscapeHandler)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside)
    document.removeEventListener('keydown', this.onEscapeHandler)
  }

  toggleExpand = (e) => {
    this.setState((prevState) => ({ expanded: !prevState.expanded }))
    // We need this to avoid triggering the collapse function from Foundation
    e.stopPropagation()
  }

  componentClickHandler = (e) => {
    // We want to hide the dropdown menu only when we click in the component but outside the menu
    if (this.wrapperRef === e.target) { this.setState({ expanded: false }) }
  }

  onChangeHandler = (value, label) => {
    if (!this.props.multiple) { this.setState({expanded: false}) }
    if (!this.props.multiple) { this.buttonRef.focus() }
    this.props.onChange && this.props.onChange(value, label)
  }

  menu = (classes) => {
    const { items, value, multiple } = this.props
    if (this.state.expanded) {
      if (multiple) {
        return (
          <DropdownMenuMultiSelect
            style={this.state.style}
            onChange={this.onChangeHandler}
            values={value}
            items={items}
            classes={classes} />
        )
      } else {
        return (
          <DropdownMenu
            style={this.state.style}
            onChange={this.onChangeHandler}
            value={value}
            items={items}
            classes={classes} />
        )
      }
    }
  }

  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({expanded: false})
    }
  }

 onEscapeHandler = (event) => {
   if (event.keyCode === 27) { this.setState({expanded: false}) }
 }

 render () {
   const {
     prompt,
     items,
     value,
     styles,
     buttonClasses,
     wrapperClasses,
     menuClasses = []
   } = this.props
   const selectedItem = find(items, { value: value })

   return (
     <div
       className={classNames('dropdown', wrapperClasses)}
       onClick={this.componentClickHandler}
       ref={(node) => { this.wrapperRef = node }}
       style={styles}>
       <button
         aria-expanded={this.state.expanded ? 'true' : 'false'}
         onClick={this.toggleExpand}
         ref={(node) => { this.buttonRef = node }}
         className={`button dropdown-button has-icon--right text-align-left ${buttonClasses ? buttonClasses.join(' ') : ''}`}
         type='button'>
         <span className='ui-icon ui-small'>
           <svg>
             <use xlinkHref='#i-arrow-down' />
           </svg>
         </span>
         {selectedItem ? selectedItem.label : prompt}
       </button>
       <div className='dropdown-menu-wrapper' aria-hidden={this.state.expanded ? 'false' : 'true'} role='menu'>
         {this.menu(menuClasses)}
       </div>
     </div>
   )
 }
}

export default Dropdown
