import React, { useRef } from 'react'

import { useReactToPrint } from 'react-to-print'

import { LotteryResults } from './LotteryResults'
import { processExcelData } from '../data/processExcelData'
import { processLotteryBuckets } from '../data/processLotteryBuckets'

const LotteryManager = ({ applications, listing }) => {
  const componentToPrint = useRef(null)
  const handlePrint = useReactToPrint({
    documentTitle: 'Lottery Results',
    removeAfterPrint: true
  })

  const groupedBuckets = Object.values(applications).reduce((acc, app) => {
    if (app.preference_lottery_rank) {
      if (acc[app.custom_preference_type]) {
        acc[app.custom_preference_type].push(app)
      } else {
        acc[app.custom_preference_type] = [app]
      }
    } else {
      if (acc.generalList) {
        acc.generalList.push(app)
      } else {
        acc.generalList = [app]
      }
    }
    return acc
  }, {})

  const processedBuckets = processLotteryBuckets(groupedBuckets)

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
