import React from 'react'
// import ReactJson from 'react-json-view'
import JSONTree from 'react-json-tree'

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};


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
          <JSONTree data={payload} invertTheme={true} theme={theme} hideRoot={true} shouldExpandNode={() => true}/>
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
