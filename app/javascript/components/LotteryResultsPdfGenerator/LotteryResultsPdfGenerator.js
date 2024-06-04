import React, { useState } from 'react'

import DropTarget from './DropTarget'
import LotteryManager from './LotteryManager'

const LotteryResultsPdfGenerator = () => {
  // somewhat awkwardly, we have two sources for the current listing: the
  // listing selected in the menu and the one specified by listing ID in the
  // URL.  one sets the other, depending on which is set first.
  const [showDropTarget, setShowDropTarget] = useState(false)
  const [spreadsheetData, setSpreadsheetData] = useState()

  const handleDragEnter = (event) => {
    // don't show the drop target if the user is not dragging a file
    if (event.dataTransfer.types.includes('Files')) {
      setShowDropTarget(true)

      // we have to prevent the default dragEnter behavior so the drop works
      event.preventDefault()
    }
  }

  const handleDragLeave = () => setShowDropTarget(false)

  const handleDrop = async (event) => {
    event.preventDefault()
    event.stopPropagation()
    setShowDropTarget(false)

    if (event.dataTransfer.types.includes('Files')) {
      const [file] = event.dataTransfer.files
      const data = await file.arrayBuffer()

      // set the URL back to root to clear any existing listing ID, since we're
      // replacing the results with the dropped file
      setSpreadsheetData(data)
    }
  }

  return (
    <>
      <div id='lottery-results-pdf-generator-container' onDragEnter={handleDragEnter}>
        <LotteryManager spreadsheetData={spreadsheetData} />
        {!showDropTarget && !spreadsheetData && (
          <div id='lottery-results-pre-drop-message'>
            <div>Drag and drop a .xlsx results spreadsheet here</div>
          </div>
        )}
        {showDropTarget && <DropTarget onDrop={handleDrop} onLeave={handleDragLeave} />}
      </div>
    </>
  )
}

export default LotteryResultsPdfGenerator
