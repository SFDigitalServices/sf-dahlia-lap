import React, { useRef } from 'react'

import { useReactToPrint } from 'react-to-print'

import Loading from 'components/molecules/Loading'

import { LotteryResults } from './LotteryResults'
import { processLotteryBuckets, massageLotteryBuckets } from './utils/processLotteryBuckets'

const LotteryManager = ({ applications, listing, useLotteryResultApi }) => {
  // set up print component
  const componentToPrint = useRef(null)
  const handlePrint = useReactToPrint({
    documentTitle: 'Lottery Results',
    removeAfterPrint: true
  })

  // process applications into buckets
  let processedBuckets = null
  if (useLotteryResultApi && applications) {
    processedBuckets = massageLotteryBuckets(applications)
  } else if (applications) {
    processedBuckets = processLotteryBuckets(applications)
  }

  return (
    <>
      {processedBuckets ? (
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
      ) : (
        <Loading isLoading />
      )}
    </>
  )
}

export default LotteryManager
