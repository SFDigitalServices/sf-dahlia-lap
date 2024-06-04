import React, { useRef } from 'react'

import { useReactToPrint } from 'react-to-print'

import { processExcelData } from './data/processExcelData'
import { processLotteryBuckets } from './data/processLotteryBuckets'
import { LotteryResults } from './LotteryResults'

const LotteryManager = ({ spreadsheetData }) => {
  const componentToPrint = useRef(null)
  const handlePrint = useReactToPrint({
    documentTitle: 'Lottery Results',
    removeAfterPrint: true
  })

  let listing = {
    name: '',
    address: '',
    date: ''
  }
  let buckets

  if (spreadsheetData) {
    const data = processExcelData(spreadsheetData)

    listing = data.listing
    buckets = processLotteryBuckets(data.results.lotteryBuckets, true)
  }

  return (
    <>
      {buckets && (
        <>
          <div id='save-lottery-results-button-container'>
            <button
              onClick={() => {
                handlePrint(null, () => componentToPrint.current)
              }}
            >
              Save Lottery Results
            </button>
          </div>
          <LotteryResults
            ref={componentToPrint}
            name={listing.name}
            address={listing.address}
            date={listing.date}
            buckets={buckets}
          />
        </>
      )}
    </>
  )
}

export default LotteryManager
