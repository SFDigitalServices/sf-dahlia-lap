import React, { useState } from 'react'

import DropTarget from './components/DropTarget'
import LotteryManager from './components/LotteryManager'

const processDrop = async (files) => {
  const [file] = files
  return await file.arrayBuffer()
}

const LotteryResultsPdfGenerator = () => {
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
    setShowDropTarget(false)

    if (event.dataTransfer.types.includes('Files')) {
      const data = await processDrop(event.dataTransfer.files)

      setSpreadsheetData(data)
    }
  }

  return (
    <div id='lottery-results-pdf-generator-container' onDragEnter={handleDragEnter}>
      {showDropTarget ? (
        <DropTarget onDrop={handleDrop} onLeave={handleDragLeave} />
      ) : spreadsheetData ? (
        <LotteryManager spreadsheetData={spreadsheetData} />
      ) : (
        <div id='lottery-results-pre-drop-message'>
          <div>Drag and drop a .xlsx results spreadsheet here</div>
        </div>
      )}
    </div>
  )
}

export default LotteryResultsPdfGenerator
