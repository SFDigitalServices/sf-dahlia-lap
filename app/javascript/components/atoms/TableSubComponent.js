import React from 'react'

import { map } from 'lodash'

const TableSubComponent = ({ items }) => {
  return (
    <ul className='subcomponent button-radio-group segmented-radios inline-group'>
      {map(items, (item, idx) => (
        <li key={idx}>
          <a className='button secondary tiny' href={item.link}>
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default TableSubComponent
