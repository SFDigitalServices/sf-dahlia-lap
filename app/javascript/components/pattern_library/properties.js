import React, { useState } from 'react'

import { JSONTree } from 'react-json-tree'

const theme = {
  scheme: 'monokai',
  author: 'somebody',
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
}

// hardcoding here. Minor component for PL
const style = {
  backgroundColor: 'white',
  padding: '10px',
  marginTop: '10px',
  borderTop: '1px solid #0077da',
  borderRadius: '3px',
  fontSize: '85%'
}

const Properties = ({ payload }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => setExpanded(!expanded)

  return expanded ? (
    <div style={style}>
      <a onClick={toggleExpand}>Hide Properties</a>
      <JSONTree data={payload} invertTheme theme={theme} hideRoot shouldExpandNode={() => true} />
    </div>
  ) : (
    <div style={style}>
      <a onClick={toggleExpand}>Show Properties</a>
    </div>
  )
}

export default Properties
