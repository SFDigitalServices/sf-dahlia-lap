import React, { useRef } from 'react'

import { useReactToPrint } from 'react-to-print'

import { LotteryResults } from './LotteryResults'
import { processLotteryBuckets } from '../data/processLotteryBuckets'
import { by } from '../utils/byFunction'

const LotteryManager = ({ applicationPrefs, listing }) => {
  // set up print component
  const componentToPrint = useRef(null)
  const handlePrint = useReactToPrint({
    documentTitle: 'Lottery Results',
    removeAfterPrint: true
  })

  // process applications into buckets
  const processedBuckets = processLotteryBuckets(applicationPrefs)

  return (
    <>
      {processedBuckets && (
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
            address={listing.building_street_address}
            buckets={processedBuckets}
          />
        </>
      )}
    </>
  )
}

export default LotteryManager
