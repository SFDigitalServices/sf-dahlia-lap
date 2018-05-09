import React from 'react'
import ReactJson from 'react-json-view'

class Properties extends React.Component {
  state = {expanded: false}
  style = {
    backgroundColor:'white',
    padding:'10px',
    marginTop:'10px',
    borderTop:'1px solid #0077da',
    borderRadius:'3px',
    fontSize:'85%'
  }

  toggleExpand = () => {
    this.setState((prevState) => {
      return { expanded: !prevState.expanded }
    })
  }


  render() {
    const { payload } = this.props


    if (this.state.expanded) {
      return (
        <div style={this.style} >
          <a onClick={this.toggleExpand}>Hide Properties</a>
          <ReactJson src={payload} />
        </div>
      )
    } else {
      return (
        <a onClick={this.toggleExpand}>Show Properties</a>
      )
    }
  }
}

export default Properties
