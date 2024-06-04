import React, { useRef } from 'react'

import { useReactToPrint } from 'react-to-print'

import { processExcelData } from './data/processExcelData'
import { processLotteryBuckets } from './data/processLotteryBuckets'
import { LotteryResults } from './LotteryResults'

const LotteryManager = ({ spreadsheetData }) => {
  const componentToPrint = useRef(null)
  const handlePrint = useReactToPrint({
    documentTitle: 'Lottery Results',
    onBeforePrint: console.log('printing...'),
    onAfterPrint: console.log('printed!'),
    removeAfterPrint: true
  })

  let name = ''
  let address = ''
  let date = ''
  let buckets

  if (spreadsheetData) {
    const { listing, results } = processExcelData(spreadsheetData)

    ;({ name, address, date } = listing)
    buckets = processLotteryBuckets(results.lotteryBuckets, true)
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
            name={name}
            address={address}
            date={date}
            buckets={buckets}
          />
        </>
      )}
    </>
  )
}

export default LotteryManager
