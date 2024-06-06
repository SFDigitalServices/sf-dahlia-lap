import React from 'react'

const DropTarget = ({ onDrop, onLeave }) => {
  return (
    <div
      id='drop-target'
      // we have to prevent the default dragOver behavior for the drop to work
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      onDragLeave={onLeave}
    >
      <div>Drag and drop a .xlsx results spreadsheet here</div>
    </div>
  )
}

export default DropTarget
