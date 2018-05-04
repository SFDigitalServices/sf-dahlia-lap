import React from 'react'
import DropdownMenu from '../molecules/dropdownMenu'
import DropdownMenuMultiSelect from '../molecules/dropdownMenuMultiSelect'
import _ from 'lodash'

/*
TODO
1. Position menu items
1. Include blank
*/
class Dropdown extends React.Component {

  constructor(props) {
    super(props)
    this.state = { expanded: false }
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggleExpand = () => {
    this.setState((prevState) => ({ expanded: !prevState.expanded }))
  }

  onChange = (value, label) => {
    if (!this.props.multiple)
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
            values={value}
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

  componentDidMount() {
   document.addEventListener('mousedown', this.handleClickOutside);
 }

 componentWillUnmount() {
   document.removeEventListener('mousedown', this.handleClickOutside);
 }

  handleClickOutside(event) {
   if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
     this.setState({expanded: false})
   }
 }

  render() {
    const { prompt, size = 'small', items, value} = this.props
    const style =  {}//{ left: '16px', top: '95px'}
    const selectedItem = _.find(items, { value: value })

    return (
      <div class="dropdown" ref={(node) => this.wrapperRef = node }>
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
